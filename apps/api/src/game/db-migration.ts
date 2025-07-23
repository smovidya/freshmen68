// well, no auto migration yet
// `@cloudflare/actors` provide this tho
// but it too late now

type Migration = {
	version: number;
	name?: string;
	up: string[];
	down?: string[];
};

// Just add migration here and when you start the server it will apply this automatically
const migration: Migration[] = [
	{
		version: 1,
		name: "Init (we use IF NOT EXISTS to not break existing tables)",
		up: [
			`CREATE TABLE IF NOT EXISTS pops (
				timestamp INTEGER NOT NULL,
				ouid TEXT NOT NULL,
				amount INTEGER NOT NULL,
				group_id TEXT NOT NULL
			);`,
			`CREATE TABLE IF NOT EXISTS leaderboard (
				playerId TEXT PRIMARY KEY,
				score INTEGER NOT NULL
			);`,
			`CREATE INDEX IF NOT EXISTS idx_score ON leaderboard (score DESC);`,
			`CREATE INDEX IF NOT EXISTS idx_playerId ON leaderboard (playerId DESC);`,
		],
		down: [
			`DROP INDEX IF EXISTS idx_playerId;`,
			`DROP INDEX IF EXISTS idx_score;`,
			`DROP TABLE IF EXISTS leaderboard;`,
			`DROP TABLE IF EXISTS pops;`,
		]
	},
	{
		version: 2,
		name: "Init add player_name to leaderboard",
		up: [
			`ALTER TABLE leaderboard ADD COLUMN player_name TEXT;`
		],
		down: [
			`ALTER TABLE leaderboard DROP COLUMN player_name;`
		]
	}
];


export async function migrate(storage: DurableObjectStorage) {
	let currentVersion = await storage.get("__migration_version") as number ?? 0;
	const startVersion = currentVersion;
	const toApplies = migration
		.filter(it => it.version > currentVersion)
		.sort((a, b) => a.version - b.version);
	const latestVersion = Math.max(...toApplies.map(m => m.version));

	if (toApplies.length === 0) {
		return;
	}

	console.log(`Trying to migrate from version ${startVersion} to version ${latestVersion}`);

	for (const mig of toApplies) {
		const ok = storage.transactionSync(() => {
			for (const sql of mig.up) {
				storage.sql.exec(sql);
			}
			return true;
		});

		if (!ok) {
			console.log(`Error applying migration ${mig.version}: ${mig.name}`);
			break;
		}

		currentVersion = mig.version;
	}

	console.log(`Migrated from version ${startVersion} to version ${currentVersion}${currentVersion === latestVersion ? " sucessfully" : ''}.`);
	await storage.put("__migration_version", currentVersion);
}

export async function rollback(storage: DurableObjectStorage, targetVersion: number) {
	const currentVersion = await storage.get("__migration_version") as number ?? 0;

	if (targetVersion >= currentVersion) {
		throw new Error(`Target version ${targetVersion} must be less than current version ${currentVersion}`);
	}

	const toRollback = migration
		.filter(it => it.version > targetVersion && it.version <= currentVersion)
		.sort((a, b) => b.version - a.version); // Sort in descending order for rollback

	for (const mig of toRollback) {
		if (!mig.down || mig.down.length === 0) {
			throw new Error(`No rollback defined for migration version ${mig.version}`);
		}

		for (const sql of mig.down) {
			storage.sql.exec(sql);
		}
	}

	await storage.put("__migration_version", targetVersion);
}


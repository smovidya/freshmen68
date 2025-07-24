export type LeaderboardEntry = {
	playerId: string;
	score: number;
	player_name?: string;
};

export class SqliteLeaderboard {
	#db: DurableObjectStorage;
	#totalScore = 0;

	constructor(db: DurableObjectStorage) {
		this.#db = db;
	}

	async initialize(fresh = false) {
		if (fresh) {
			this.#db.sql.exec(`DELETE FROM leaderboard`);
			this.#totalScore = 0;

			const aggregatedPops = this.#db.sql.exec<{ ouid: string; total_score: number; }>(
				`SELECT ouid, SUM(amount) as total_score FROM pops GROUP BY ouid`
			).toArray();

			for (const pop of aggregatedPops) {
				this.#db.sql.exec(
					`INSERT INTO leaderboard (playerId, score) VALUES (?, ?)`,
					pop.ouid,
					pop.total_score
				);
				this.#totalScore += pop.total_score;
			}

			await this.#db.put("total_score", this.#totalScore);
		} else {
			// Load cached total score, or calculate from leaderboard if not cached
			const cachedTotal = await this.#db.get("total_score") as number;
			if (cachedTotal !== undefined) {
				this.#totalScore = cachedTotal;
			} else {
				// Calculate total from leaderboard and cache it
				const result = this.#db.sql.exec<{ total_score: number; }>(`SELECT SUM(score) as total_score FROM leaderboard`).one();
				this.#totalScore = result?.total_score || 0;
				await this.#db.put("total_score", this.#totalScore);
			}
		}
	}

	async addScore(playerId: string, score: number) {
		this.#totalScore += score;
		this.#db.sql.exec(
			`INSERT INTO leaderboard (playerId, score)
	             VALUES (?, ?)
	             ON CONFLICT(playerId) DO UPDATE SET
	                score = leaderboard.score + EXCLUDED.score`,
			playerId,
			score
		);
		// this is synchronous btw
		await this.#db.put("total_score", this.#totalScore);
	}

	getPlayerScore(playerId: string): number {
		// TODO: create an index for this
		const score = this.#db.sql.exec(
			`SELECT score FROM leaderboard WHERE playerId = ?`,
			playerId
		).toArray();
		if (score.length > 0) {
			return score[0].score as number;
		}
		return 0;
	}

	updatePlayerName(playerId: string, playerName: string) {
		this.#db.sql.exec(
			`INSERT INTO leaderboard (playerId, player_name, score)
							VALUES (?, ?, 0)
							ON CONFLICT(playerId) DO UPDATE SET
								player_name = EXCLUDED.player_name
			`,
			playerId,
			playerName
		);
	}

	getPlayerName(playerId: string) {
		return this.#db.sql.exec<{ player_name: string; }>(
			`SELECT player_name FROM leaderboard WHERE playerId = ?`,
			playerId,
		).one().player_name;
	}

	getTopScores(limit: number = 10): LeaderboardEntry[] {
		const rows = this.#db.sql.exec<LeaderboardEntry>(
			`SELECT playerId, score, player_name
             FROM leaderboard
             ORDER BY score DESC
             LIMIT ?`,
			limit
		).toArray();
		return rows;
	}

	getTotalPlayers() {
		const result = this.#db.sql.exec<{ count: number; }>(`SELECT COUNT(*) as count FROM leaderboard`).one();
		return result.count;
	}

	get totalScore() {
		return this.#totalScore;
	}
}

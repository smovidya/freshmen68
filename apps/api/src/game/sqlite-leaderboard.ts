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

	async initialize(fresh = true) {
		if (fresh) {
			const result = this.#db.sql.exec<{ total_score: number; }>(`SELECT SUM(score) as total_score FROM leaderboard`).one();
			this.#totalScore = result?.total_score || 0;
		} else {
			this.#totalScore = await this.#db.get("total_score") as number || 0;
		}
	}

	addScore(playerId: string, score: number) {
		this.#totalScore += score;
		this.#db.sql.exec(
			`INSERT INTO leaderboard (playerId, score)
	             VALUES (?, ?)
	             ON CONFLICT(playerId) DO UPDATE SET
	                score = leaderboard.score + EXCLUDED.score`,
			playerId,
			score
		);
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

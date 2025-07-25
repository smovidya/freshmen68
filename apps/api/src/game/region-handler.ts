import { DurableObject } from "cloudflare:workers";
import { SqliteLeaderboard } from "./sqlite-leaderboard";
import { migrate } from "./db-migration";

export type UserPops = {
	ouid: string,
	total_pops: number;
};
export type GroupPops = {
	group_id: number,
	total_pops: number;
};

export class GameRegionHandler extends DurableObject<Env> {
	leaderboard!: SqliteLeaderboard;

	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);

		this.leaderboard = new SqliteLeaderboard(ctx.storage);
		ctx.blockConcurrencyWhile(async () => {
			await migrate(this.ctx.storage);
			await this.leaderboard.initialize();
		});
	}

	addPop(count: number, ouid: string, groupNumber: string) {
		// console.log(`Add score ${count} to ${ouid} in ${groupNumber}`);
		this.leaderboard.addScore(ouid, count);
		this.ctx.storage.sql.exec("INSERT INTO pops (timestamp, ouid, amount, group_id) VALUES (?, ?, ?, ?)", Date.now(), ouid, count, groupNumber);
	}

	setPlayerName(ouid: string, name: string) {
		this.leaderboard.updatePlayerName(ouid, name);
	}

	getPlayerName(ouid: string) {
		return this.leaderboard.getPlayerName(ouid);
	}

	getTotalScore() {
		return this.leaderboard.totalScore;
	}

	getTopTen() {
		return this.leaderboard.getTopScores(10);
	}

	getPlayerScore(ouid: string) {
		const score = this.leaderboard.getPlayerScore(ouid);
		return score;
	}

	dumpAllPop() {
		return this.ctx.storage.sql.exec(`SELECT * from pops`).toArray();
	}

	reset() {
		this.ctx.storage.sql.exec("DELETE FROM leaderboard")
		this.ctx.storage.sql.exec("DELETE FROM pops")
	}
}

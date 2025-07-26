import { env } from "cloudflare:workers";
import type { GameRegionHandler } from "./region-handler";
import type { LeaderboardEntry } from "./sqlite-leaderboard";

export type GameRegion = {
	groupNumber: string;
	handler: DurableObjectStub<GameRegionHandler>;
};

export const groupNumbers = ["1", "3", "4", "5", "6", "7"];

export function getRegionHandler(groupNumber: string) {
	if (!groupNumbers.includes(groupNumber) && env.WORKER_ENV === 'production') {
		throw new Error(`${groupNumber} dont exist`);
	}

	return env.GAME_REGION_HANDLER.get(env.GAME_REGION_HANDLER.idFromName(`group:${groupNumber}`));
}

export function getRegionHandlers(groups = groupNumbers): GameRegion[] {
	return groups.map(i => ({
		groupNumber: i,
		handler: getRegionHandler(i)
	}));
}

export async function getPopByGroups() {
	const scores = await Promise.all(
		getRegionHandlers()
			.map(async (it) => {
				return [
					it.groupNumber,
					await it.handler.getTotalScore()
				];
			})
	);

	return Object.fromEntries(scores) as Record<number, number>;
}

export async function dumpStats() {
	const scores = await Promise.all(
		getRegionHandlers()
			.map(async (it) => {
				return {
					groupNumber: it.groupNumber,
					totalScore: await it.handler.getTotalScore(),
					leaderboard: await it.handler.getTopTen(),
				};
			})
	);

	return scores;
}

import { createDatabaseConnection } from '@freshmen68/db'
import { teams } from "@freshmen68/db/schemas"
import parse from "csv-simple-parser";
import { eq, ne, gt, gte } from "drizzle-orm";

const db = createDatabaseConnection("")
const file = await Bun.file("./results_team_processed_with_groups.csv")
const csv = parse((await file.text()).trim(), { header: true, delimiter: "," }).filter(row => !!row) as {
	id: string;
	result: string;
}[];


console.log(csv)
await db.transaction(async (tx) => {
	for (const row of csv) {
		const { id, result } = row;
		console.log(result, id)
		await tx.update(teams)
			.set({
				result: result
			})
			.where(eq(teams.id, id))
	}
})

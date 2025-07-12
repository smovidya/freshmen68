import { eq, and } from "drizzle-orm";
import { tables, type Db, type Tx } from "@freshmen68/db";
import type { groupPreferenceSchema } from "@freshmen68/dto";
import type z from "zod/v4";

export async function updateGroupPreference(userId: string, preference: z.infer<typeof groupPreferenceSchema>, db: Db | Tx) {
  const preferenceString = preference.join(",");

  // Update the team's group preference using JOIN
  await db
    .update(tables.teams)
    .set({ groupNumberPreferenceOrder: preferenceString })
    .from(tables.students)
    .where(
      and(
        eq(tables.teams.id, tables.students.teamOwnedId),
        eq(tables.students.id, userId)
      )
    );
}

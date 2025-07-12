import { eq, count } from "drizzle-orm";
import { tables, type Db, type Tx } from "@freshmen68/db";
import { createRandomGroupNumberPreferenceOrder } from "./group.service";

export async function joinTeam(userId: string, teamCode: string, db: Db | Tx) {
  return await db.transaction(async (tx) => {
    const teams = await tx
      .select({
        id: tables.teams.id,
      })
      .from(tables.teams)
      .where(eq(tables.teams.teamCodes, teamCode))
      .limit(1);

    if (teams.length === 0) {
      return "team-not-founded";
    }

    const team = teams[0]!;

    const ret = await tx
      .select({ count: count() })
      .from(tables.students)
      .where(eq(tables.students.teamId, team.id));

    const currentMemberCount = ret[0]!.count;

    if (currentMemberCount >= 2) {
      return "team-full";
    }

    // Update the user's teamId
    await tx
      .update(tables.students)
      .set({ teamId: team.id })
      .where(eq(tables.students.id, userId));

    return "ok";
  });
}

export async function regenerateTeamCode(ownerId: string, db: Db | Tx) {
  const teamCodes = await generateTeamCode(db);
  await db
    .update(tables.teams)
    .set({ teamCodes })
    .where(
      eq(
        tables.teams.id,
        db.select({ teamId: tables.students.teamOwnedId })
          .from(tables.students)
          .where(eq(tables.students.id, ownerId))
      )
    );
}

export async function generateTeamCode(db: Db | Tx): Promise<string> {
  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate 6-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Check if code already exists
    const existingTeam = await db
      .select({ id: tables.teams.id })
      .from(tables.teams)
      .where(eq(tables.teams.teamCodes, code))
      .limit(1);

    if (existingTeam.length === 0) {
      return code;
    }
  }

  throw new Error(`Failed to generate unique team code after ${maxAttempts} attempts`);
}

export async function getOwnedTeam(userId: string, db: Db | Tx) {
  const members = await getOwnedTeamMember(userId, db);
  const [meta] = await db
    .select({
      groupNumberPreferenceOrder: tables.teams.groupNumberPreferenceOrder,
      resultGroupNumber: tables.teams.resultGroupNumber,
      teamCodes: tables.teams.teamCodes
    })
    .from(tables.teams)
    .where(
      eq(
        tables.teams.id,
        db.select({ teamId: tables.students.teamOwnedId })
          .from(tables.students)
          .where(eq(tables.students.id, userId))
      )
    )
    .limit(1);

  return {
    teamCodes: meta!.teamCodes,
    resultGroupNumber: meta!.resultGroupNumber,
    groupPreferenceOrder: meta!
      .groupNumberPreferenceOrder
      ?.split(",")
      .map(it => parseInt(it))
      ?? createRandomGroupNumberPreferenceOrder(), // this already exist tho
    members
  };
}

export async function getOwnedTeamMember(userId: string, db: Db | Tx) {
  const students = await db
    .select({
      firstname: tables.students.firstName,
      lastName: tables.students.lastName,
      nickname: tables.students.nickname,
      department: tables.students.department,
    })
    .from(tables.students)
    .where(
      eq(
        tables.students.teamId,
        db.select({ teamId: tables.students.teamOwnedId })
          .from(tables.students)
          .where(eq(tables.students.id, userId))
      )
    );

  return students;
}

import { tables, type Db, type Tx } from "@freshmen68/db";
import type { registrationSchema } from "@freshmen68/dto";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { generateTeamCode } from "./team.service";


function createRandomGroupNumberPreferenceOrder() {
  const numbers = [1, 3, 4, 5, 6, 7];

  // Fisher-Yates shuffle algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j]!, numbers[i]!];
  }

  // TODO: may be change the format
  return numbers.join(',');
}

export async function createStudentWithTeam(input: z.infer<typeof registrationSchema>, db: Db | Tx) {
  return await db.transaction(async (tx) => {
    // Generate unique team code
    const teamCode = await generateTeamCode(tx);

    // First, create the team
    const [team] = await tx
      .insert(tables.teams)
      .values({
        creatorId: '', // We'll update this after creating the student
        groupNumberPreferenceOrder: createRandomGroupNumberPreferenceOrder(),
        teamCodes: teamCode,
      })
      .returning();

    if (!team) {
      throw new Error('Failed to create team');
    }

    const [student] = await tx.insert(tables.students).values({
      department: input.department,
      email: input.email,
      emergencyContactName: input.emergencyContactName,
      emergencyContactPhone: input.emergencyContactPhone,
      emergencyContactRelationship: input.emergencyContactRelationship,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      studentId: input.studentId,
      title: input.title,
      dragAllergies: input.drugAllergies,
      foodAllergies: input.foodAllergies,
      foodLimitations: input.foodLimitations,
      medicalConditions: input.medicalConditions,
      nickname: input.nickname,
      teamOwnedId: team.id,
      teamId: team.id, // Student belongs to their own team
    }).returning();

    if (!student) {
      // TODO: better error type and error filter
      throw new Error("Cannot create student");
    }

    await tx
      .update(tables.teams)
      .set({ creatorId: student.id })
      .where(eq(tables.teams.id, team.id));

    return { student, team };
  });
}

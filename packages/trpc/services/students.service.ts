import { tables, type Db, type Tx } from "@freshmen68/db";
import type { registrationSchema } from "@freshmen68/dto";
import { eq } from "drizzle-orm";
import z from "zod/v4";
import { createRandomGroupNumberPreferenceOrder } from "./group.service";
import { generateTeamCode } from "./team.service";


export async function isRegistered(email: string, db: Db | Tx) {
  const existed = await db
    .select({})
    .from(tables.students)
    .where(eq(tables.students.email, email));

  return existed.length !== 0;
}

export async function createStudentWithTeam(input: z.infer<typeof registrationSchema>, email: string, db: Db | Tx) {
  const studentId = email.split("@")[0]!;
  
  // Check if student already exists
  if (await isRegistered(email, db)) {
    throw new Error('Student is already registered');
  }
  
  return await db.transaction(async (tx) => {
    // Generate unique team code
    const teamCode = await generateTeamCode(tx);

    // First, create the team
    const [team] = await tx
      .insert(tables.teams)
      .values({
        creatorId: '', // We'll update this after creating the student
        groupNumberPreferenceOrder: createRandomGroupNumberPreferenceOrder().join(','),
        teamCodes: teamCode,
      })
      .returning();

    if (!team) {
      throw new Error('Failed to create team');
    }

    const [student] = await tx.insert(tables.students).values({
      department: input.department,
      email,
      emergencyContactName: input.emergencyContactName,
      emergencyContactPhone: input.emergencyContactPhone,
      emergencyContactRelationship: input.emergencyContactRelationship,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      studentId,
      title: input.title,
      dragAllergies: input.drugAllergies,
      foodAllergies: input.foodAllergies,
      foodLimitations: input.foodLimitations,
      medicalConditions: input.medicalConditions,
      nickname: input.nickname,
      teamOwnedId: team.id,
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

export async function getStudentByEmail(email: string, db: Db | Tx) {
  const student = await db
    .select({
      firstname: tables.students.firstName,
      lastName: tables.students.lastName,
      nickname: tables.students.nickname,
      department: tables.students.department,
    })
    .from(tables.students)
    .where(eq(tables.students.email, email))
    .limit(1);

  if (student.length === 0) {
    return null;
  }

  return student[0];
}

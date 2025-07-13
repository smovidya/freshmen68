import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas/schema';
import postgres from 'postgres';

const db = drizzle(postgres("postgres://root:mysecretpassword@localhost:5541/local"), {
  schema
});

async function seed() {
  await db.transaction(async tx => {
    const [team] = await tx
      .insert(schema.teams)
      .values({
        creatorId: '奏', // We'll update this after creating the student
        groupNumberPreferenceOrder: "1,3,4,5,6,7",
        teamCodes: "594F",
      })
      .returning();

    if (!team) {
      throw new Error('Failed to create team');
    }

    await tx.insert(schema.students).values({
      department: "input.department",
      email: "input.email@email.input",
      emergencyContactName: "input.emergencyContactName",
      emergencyContactPhone: "191",
      emergencyContactRelationship: "input.emergencyContactRelationship",
      firstName: "input.firstName",
      lastName: "input.lastName",
      phone: "1669",
      studentId: "6888888888",
      title: "Her majesty",
      dragAllergies: "input.drugAllergies",
      foodAllergies: "input.foodAllergies",
      foodLimitations: "input.foodLimitations",
      medicalConditions: "input.medicalConditions",
      nickname: "input.nickname",
      teamOwnedId: team.id,
      id: "奏"
    }).returning();
  });
}

await seed();
console.log("Done")

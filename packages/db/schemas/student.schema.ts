import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const students = pgTable('students', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  nickname: text('nickname'),
  studentId: text('student_id').notNull().unique(),
  department: text('department').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  emergencyContactName: text('emergency_contact_name').notNull(),
  emergencyContactPhone: text('emergency_contact_phone').notNull(),
  emergencyContactRelationship: text('emergency_contact_relationship').notNull(),
  medicalConditions: text('medical_conditions'),
  dragAllergies: text('allergies'),
  foodAllergies: text('food_allergies'),
  foodLimitations: text('food_limitations'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  teamOwnedId: text('team_owner_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'restrict' }),
  teamId: text('team_id')
    .references(() => teams.id, { onDelete: 'set null' }),
}, (table) => [
  index('idx_students_student_id').on(table.studentId),
  index('idx_students_email').on(table.email),
]);

export const availableGroups = pgTable('available_groups', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  number: text('number').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  groupMetadata: text('group_metadata'),
  maxMembers: integer('max_members').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
}, (table) => [
  index('idx_available_groups_number').on(table.number),
]);

export const teams = pgTable('teams', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  creatorId: text('creator_id')
    .notNull(),
  groupNumberPreferenceOrder: text('group_number_preference_order'),
  isSubmitted: boolean('is_submitted')
    .$defaultFn(() => false)
    .notNull(),
  resultGroupNumber: text('result_group_number')
    .references(() => availableGroups.id, { onDelete: 'cascade' }),
  teamCodes: text('team_codes').unique().notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .$onUpdateFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const studentsRelations = relations(students, ({ one }) => ({
  teamOwned: one(teams, {
    fields: [students.teamOwnedId],
    references: [teams.id],
  }),
  team: one(teams, {
    fields: [students.teamId],
    references: [teams.id],
  }),
}));

export const availableGroupsRelations = relations(availableGroups, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  users: many(user),
  creator: one(students, {
    fields: [teams.creatorId],
    references: [students.id],
  }),
  group: one(availableGroups, {
    fields: [teams.resultGroupNumber],
    references: [availableGroups.id],
  }),
}));

import type { AppRouter } from "@freshmen68/trpc";

export type Student = NonNullable<Awaited<ReturnType<AppRouter["user"]["getStudentInfo"]>>>;
export type Team = NonNullable<Awaited<ReturnType<AppRouter["team"]["getJoinedTeam"]>>>;
export type TeamMember = Team["members"][number];

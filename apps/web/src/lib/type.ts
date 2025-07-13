import type { AppRouter } from "@freshmen68/trpc";

export type Student = NonNullable<Awaited<ReturnType<AppRouter["user"]["getStudentInfo"]>>>;
export type OwnedTeam = NonNullable<Awaited<ReturnType<AppRouter["team"]["getOwnedTeam"]>>>;
export type JoinedTeam = NonNullable<Awaited<ReturnType<AppRouter["team"]["getJoinedTeam"]>>>;
export type TeamMember = OwnedTeam["members"][number];

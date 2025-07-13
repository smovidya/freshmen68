import type { TeamMember } from "./type";

export function getDisplayName(member: TeamMember) {
  return `${member.nickname ?? member.firstname} ${member.department}`
}
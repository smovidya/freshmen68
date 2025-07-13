<script lang="ts">
	import type { Student, Team, TeamMember } from '$lib/type';

	interface Props {
		team: Team;
	}

	let { team }: Props = $props();

	const member: TeamMember[] = $derived([...team.members]);
</script>

joined {team.id}

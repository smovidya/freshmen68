<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getDisplayName } from '$lib/idk';
	import type { Team } from '$lib/type';

	interface Props {
		team: Team;
	}

	let { team }: Props = $props();
</script>

<div class="self-stretch md:self-end">
	<h3 class="text-xl font-medium">สมาชิกปัจจุบัน</h3>
	<ul class="mt-2 leading-6">
		<li>{getDisplayName(team.owner)} (หัวห้อง)</li>
		{#each team.members as m}
			<li>
				{getDisplayName(m)}
				<Button variant="secondary" class="h-6 pb-1" size="sm">ลบ</Button>
			</li>
		{/each}
	</ul>
	{#if team.members.length < 2}
		<p>(ว่าง {2 - team.members.length})</p>
	{/if}
</div>

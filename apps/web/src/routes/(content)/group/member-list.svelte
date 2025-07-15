<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getDisplayName } from '$lib/idk.svelte';
	import type { JoinedTeam, OwnedTeam } from '$lib/type';

	interface Props {
		team: OwnedTeam | JoinedTeam;
		openKickDialog?: (email: string) => void;
	}

	let { team, openKickDialog }: Props = $props();
</script>

<div class="self-stretch md:self-end">
	<h3 class="text-xl font-semibold">สมาชิกปัจจุบัน</h3>
	<ul class="mt-1 leading-6">
		<li>{getDisplayName(team.owner)} (หัวห้อง)</li>
		{#each [...team.members] as m}
			<li>
				{getDisplayName(m)}
				{#if openKickDialog}
					<Button 
						variant="destructive" 
						class="h-6" 
						size="sm"
						onclick={() => openKickDialog(m.email)}
					>
						ลบ
					</Button>
				{/if}
			</li>
		{/each}
	</ul>
	{#if team.members.length < 2}
		<p>(ว่าง {2 - team.members.length})</p>
	{/if}
</div>

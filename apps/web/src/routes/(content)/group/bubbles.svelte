<script lang="ts">
	import { getAvatarUrl } from '$lib/avartar';
	import { getDisplayName } from '$lib/idk.svelte';
	import type { TeamMember } from '$lib/type';
	import { cn } from '$lib/utils';

	interface Props {
		member: TeamMember[];
	}

	let { member }: Props = $props();

	const avartars = $derived(member.map((m) => getAvatarUrl(m)));
</script>

<div class="relative pr-25">
	<div class={cn('bg-muted size-32 overflow-clip rounded-full')}>
		<img src={avartars[0]} alt={getDisplayName(member[0])} />
	</div>
	<div
		class={cn(
			'mt-2 ml-10  size-22 rounded-full',
			member[1] ? 'bg-muted' : 'border-muted-foreground/60 border-2 border-dashed'
		)}
	>
		{#if avartars[1]}
			<img src={avartars[1]} alt={getDisplayName(member[1])} />
		{/if}
	</div>
	<div
		class={cn(
			'absolute top-0 left-0 mt-16 ml-32 size-25 rounded-full',
			member[2] ? 'bg-muted' : 'border-muted-foreground/60 border-2 border-dashed'
		)}
	>
		{#if avartars[2]}
			<img src={avartars[2]} alt={getDisplayName(member[2])} />
		{/if}
	</div>
</div>

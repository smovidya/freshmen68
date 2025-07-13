<script lang="ts">
	import type { TeamMember } from '$lib/type';
	import { cn } from '$lib/utils';

	interface Props {
		member: TeamMember[];
	}

	let { member }: Props = $props();

</script>

<div class="relative pr-25">
	<div class={cn('size-32 rounded-full bg-muted')}></div>
	<div class={cn('mt-2 ml-10  size-22 rounded-full', member[1] ? 'bg-muted' : 'border-2 border-muted-foreground border-dashed')}></div>
	<div
		class={cn(
			'absolute top-0 left-0 mt-16 ml-32 size-25 rounded-full',
			member[2] ? 'bg-muted' : 'border-2 border-muted-foreground border-dashed'
		)}
	></div>
</div>

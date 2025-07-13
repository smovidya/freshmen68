<script lang="ts">
	import { cn } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = HTMLAnchorAttributes;

	let { class: className, ...rest }: Props = $props();
</script>

<a class={cn('size-10 rounded-full bg-black/7 hover:bg-black/10 transition-colors text-yellow-950 flex items-center justify-center', className)} {...rest}>
	<ChevronLeft />
</a>

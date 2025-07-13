<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import '@fontsource-variable/noto-sans-thai';
	import { registerFlashConsumer } from '$lib/flash.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	onMount(() => registerFlashConsumer())
</script>

<Toaster />
<div class="min-h-screen bg-radial from-[#F7CF76] to-[#F7CF76]/30">
	{@render children()}
</div>

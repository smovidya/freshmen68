<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import '@fontsource-variable/noto-sans-thai';
	import { registerFlashConsumer } from '$lib/flash.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	let { children } = $props();

	onMount(() => registerFlashConsumer());

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<svelte:head>
	<title>เทศกาลต้อนรับนิสิตใหม่ คณะวิทย์จุฬา</title>
</svelte:head>

<Toaster />
<div class="flex min-h-screen">
	{@render children()}
</div>

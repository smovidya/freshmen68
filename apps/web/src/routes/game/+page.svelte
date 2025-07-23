<script lang="ts">
	import AddMeToGroup from './add-me-to-group.svelte';
	import GameOn from './game-on.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	let { data } = $props();
</script>

<svelte:head>
	<title>ป้อบแค๊ตที่เรารัก</title>
	<meta name="description" content="ป้อบแค๊ตที่เรารัก" />
</svelte:head>

<Toaster />
<main class="flex h-screen flex-col items-center justify-center bg-gray-100">
	{#if data.whoami.group}
		<GameOn studentGroup={data.whoami.group} studentOuid={data.whoami.ouid} />
	{:else}
		<AddMeToGroup />
	{/if}
</main>

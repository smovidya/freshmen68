<script lang="ts">
	import AddMeToGroup from './add-me-to-group.svelte';
	import GameOn from './game-on.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { GameAPIClient } from '$lib/game.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();

	const client = new GameAPIClient(false);
	onMount(() => {
		client.refreshToken();
	});
</script>

<svelte:head>
	<title>ศึกเทพป็อปปลดล็อกแดนสวรรค์</title>
	<meta
		name="description"
		content="ศึกเทพป็อปปลดล็อกแดนสวรรค์ Mini Game กระชับควาสัมพันธ์ระหว่างแคว้นรับน้องทั้ง 6 แห่ง เทศกาลต้อนรับนิสิตใหม่ประจำปี 2568 คณะวิทยาศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย"
	/>
</svelte:head>

<Toaster />
<main class="flex h-screen flex-col items-center justify-center bg-gray-100">
	{#if data.whoami.group}
		<GameOn {client} studentGroup={data.whoami.group} studentOuid={data.whoami.ouid} />
	{:else}
		<AddMeToGroup {client} />
	{/if}
</main>

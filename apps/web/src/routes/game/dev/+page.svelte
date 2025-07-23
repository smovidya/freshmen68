<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { GameAPIClient } from '$lib/game.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const group = $derived(data.whoami?.group ?? '1');

	const client = new GameAPIClient(false);

	let state = $state({});

	const a = async () => {
		state.leaderboard = await client.getGlobalLeaderboard();
	};
	const b = async () => {
		state.inGroup = await client.getInGroupLeaderboard(group);
	};
	const c = async () => {
		state.self = await client.getSelfPopCount();
	};
	const d = () => client.submitPop();
	let name = $state('');
	const e = () => client.updateName(name);

	onMount(async () => {
		await client.refreshToken();
		a();
		b();
		c();
		d();
	});
</script>

<Button onclick={a}>global leaderboard</Button>
<Button onclick={b}>in group leaderboard</Button>
<Button onclick={c}>self count</Button>
<Button onclick={d}>pop</Button>

<div>
	<Input bind:value={name} />
	<Button onclick={e}>Update name</Button>
</div>

<p>note: global leaderboard work by setting fixed group key</p>
<pre>{JSON.stringify(state, null, 2)}</pre>

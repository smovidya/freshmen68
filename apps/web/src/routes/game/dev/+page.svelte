<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import { GameAPIClient } from '$lib/game.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	const group = $derived(data.whoami?.group ?? '1');

	const client = new GameAPIClient(false);
	onMount(() => {
		client.refreshToken();
	});

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
</script>

<Button onclick={a}>global leaderboard</Button>
<Button onclick={b}>in group leaderboard</Button>
<Button onclick={c}>self count</Button>
<Button onclick={d}>pop</Button>

<p>note: global leaderboard work by setting fixed group key</p>
<pre>{JSON.stringify(state, null, 2)}</pre>

<script lang="ts">
	import { gameApiPrefix, getJWTToken } from '$lib/game';

	const b = async () => {
		const token = await getJWTToken();
		await fetch(`${gameApiPrefix}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	};
</script>

<button onclick={() => b()}> auth </button>

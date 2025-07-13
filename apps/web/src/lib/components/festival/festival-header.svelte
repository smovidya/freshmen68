<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import { LogOutIcon } from 'lucide-svelte';
	import Button from '../ui/button/button.svelte';
	import { goto } from '$app/navigation';
	const { title = 'เทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์', subtitle = 'จุฬาลงกรณ์มหาวิทยาลัย' } =
		$props();

	const session = authClient.useSession();
</script>

<div class="text-center">
	<h1 class="my-5 text-center text-2xl font-bold">
		{title}<br />{subtitle}
	</h1>
	{#if $session.data?.user}
		<div class="flex items-center justify-center">
			ยินดีต้อนรับ {$session.data?.user.name} ({$session.data?.user.ouid})
			<Button
				size="icon"
				variant="ghost"
				onclick={async () => {
					await authClient.signOut();
					await goto('/');
				}}
			>
				<LogOutIcon />
			</Button>
		</div>
	{/if}
</div>

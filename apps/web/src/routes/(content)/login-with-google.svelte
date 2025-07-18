<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import Button from '$lib/components/ui/button/button.svelte';

	const { class: className }: { class?: string } = $props();
</script>

<Button
	onclick={() => {
		authClient.signIn.social({
			provider: 'google',
			callbackURL: '/menu'
		});
	}}
	class={className}
	size="lg"
>
	เข้าสู่ระบบด้วย Chula SSO
</Button>

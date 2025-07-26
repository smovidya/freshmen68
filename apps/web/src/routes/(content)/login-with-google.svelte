<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import { flags } from '$lib/flags';
	import { cn } from '$lib/utils';

	const { class: className }: { class?: string } = $props();
</script>

<Button
	onclick={() => {
		authClient.signIn.social({
			provider: 'google',
			callbackURL: flags.isEnabled('game-playing') ? '/game' : '/menu'
		});
	}}
	class={cn(
		'h-16 w-full cursor-pointer text-lg transition-transform hover:scale-105 hover:bg-amber-400 active:scale-100',
		className
	)}
	size="lg"
>
	<div class="flex flex-col items-center justify-center gap-2">
		<span>เข้าสู่ระบบด้วย Chula SSO</span>
		<span class="text-xs">เลือก @student.chula.ac.th</span>
	</div>
</Button>

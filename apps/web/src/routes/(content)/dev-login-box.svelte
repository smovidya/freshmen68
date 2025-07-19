<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	let studentId = '';
	const session = authClient.useSession();
</script>

<div class="flex flex-col items-center rounded-2xl border-2 border-red-700 p-5 text-center text-lg">
	dev mode debug box
	<div class="flex max-w-72 flex-row items-center justify-center gap-2">
		{#if $session.data?.user}
			<!-- already logged in -->
			<Input
				type="text"
				name="studentId"
				placeholder="68xxxxxx23"
				bind:value={studentId}
				class="w-full"
				required
			/>
			<Button
				type="submit"
				onclick={async () => {
					await authClient.signOut();
					if (
						!studentId.startsWith('68') ||
						studentId.length !== 10 ||
						isNaN(Number(studentId)) ||
						!studentId.endsWith('23')
					) {
						alert('กรุณากรอกรหัสนิสิตที่ถูกต้อง (เริ่มต้นด้วย 68, 10 หลัก, ลงท้ายด้วย 23)');
						return;
					}
					const { data, error } = await authClient.signUp.email({
						email: `${studentId}@student.chula.ac.th`,
						password: 'password1234',
						name: 'นิสิตสมมติ',
						callbackURL: '/menu'
					});
					if (error?.code === 'USER_ALREADY_EXISTS') {
						await authClient.signIn.email({
							email: `${studentId}@student.chula.ac.th`,
							password: 'password1234',
							callbackURL: '/menu'
						});
					}
					// await invalidate('data:auth');
				}}
			>
				เข้าสู่ระบบ
			</Button>
		{:else}
			<Input
				type="text"
				name="studentId"
				placeholder="68xxxxxx23"
				bind:value={studentId}
				class="w-full"
				required
			/>
			<Button
				type="submit"
				onclick={async () => {
					if (
						!studentId.startsWith('68') ||
						studentId.length !== 10 ||
						isNaN(Number(studentId)) ||
						!studentId.endsWith('23')
					) {
						alert('กรุณากรอกรหัสนิสิตที่ถูกต้อง (เริ่มต้นด้วย 68, 10 หลัก, ลงท้ายด้วย 23)');
						return;
					}
					const { data, error } = await authClient.signUp.email({
						email: `${studentId}@student.chula.ac.th`, // สมมติอีเมลนิสิต
						password: 'password1234',
						name: 'นิสิตสมมติ',
						callbackURL: '/menu'
					});
					if (error?.code === 'USER_ALREADY_EXISTS') {
						await authClient.signIn.email({
							email: `${studentId}@student.chula.ac.th`, // สมมติอีเมลนิสิต
							password: 'password1234',
							callbackURL: '/menu'
						});
					}
					// await invalidate('data:auth');
				}}
			>
				เข้าสู่ระบบ
			</Button>
		{/if}
	</div>
	<div class="mt-2 max-w-80 text-sm text-gray-600">
		{#if $session.data?.user}
			(DEMO) ตอนนี้คุณคือ {$session.data?.user.name} ({$session.data?.user.email})
			กรอกรหัสนิสิตอื่นเพื่อเปลี่ยนผู้ใช้
		{:else}
			(DEMO) กรอกรหัสนิสิตเพื่อเข้าสู่ระบบ
		{/if}
	</div>
</div>

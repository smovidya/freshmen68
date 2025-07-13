<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import SunImage from '$lib/assets/sun.svg';
	import RightCloud6Image from '$lib/assets/right-cloud6.png';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import FloatingElements from './floating-elements.svelte';
	const session = authClient.useSession();

	let studentId = '';
</script>

<main class="relative container mx-auto flex min-h-screen flex-col items-center justify-center">
	<FloatingElements />
	<div class="z-10 mx-auto flex min-h-screen flex-col items-center justify-center">
		<div>
			<img src={SunImage} alt="Sun" class="mb-4 size-32" />
		</div>
		<div class="mt-5 flex flex-col items-center">
			<h1 class="text-center text-2xl font-bold">
				เทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์<br />จุฬาลงกรณ์มหาวิทยาลัย
			</h1>
			<div
				class="mt-20 flex flex-col items-center rounded-2xl border-2 border-red-700 p-5 text-center text-lg"
			>
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
									email: `${studentId}@student.chula.ac.th.mock`,
									password: 'password1234',
									name: 'นิสิตสมมติ'
								});
								if (error?.code === 'USER_ALREADY_EXISTS') {
									await authClient.signIn.email({
										email: `${studentId}@student.chula.ac.th.mock`,
										password: 'password1234'
									});
								}
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
									email: `${studentId}@student.chula.ac.th.mock`, // สมมติอีเมลนิสิต
									password: 'password1234',
									name: 'นิสิตสมมติ'
								});
								if (error?.code === 'USER_ALREADY_EXISTS') {
									await authClient.signIn.email({
										email: `${studentId}@student.chula.ac.th.mock`, // สมมติอีเมลนิสิต
										password: 'password1234'
									});
								}
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
			<img src={RightCloud6Image} height={50} alt="Right Cloud" class="mt-4 h-10" />
		</div>
	</div>
</main>

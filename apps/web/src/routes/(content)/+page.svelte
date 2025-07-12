<script lang="ts">
	import { authClient } from '$lib/auth/client';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	const session = authClient.useSession();

	let studentId = '';
</script>

<main class="container mx-auto flex min-h-screen flex-col items-start justify-center p-5">
	<h1 class="text-2xl font-bold">SMO Vidya - Freshmen 68 Grouper</h1>
	<p>(DEMO) เว็บไซต์จับปูใส่กระด้ง จับนักศึกษาใหม่ลงกรุ้บ <s>(Love blood จับน้องให้ลงกรุ้บ)</s></p>
	<p>
		นี่เป็นเวอร์ชัน demo ให้กรอกรหัสนิสิตสมมติเพื่อทดลองระบบ (เวอร์ชันจริงจะล็อกอินด้วยอีเมลนิสิต)
	</p>
	{#if $session.user}
		{JSON.stringify($session.user, null, 2)}
	{:else}
		<p class="text-red-500">กรุณาเข้าสู่ระบบก่อน</p>
		<form>
			<Input
				type="text"
				name="studentId"
				placeholder="รหัสนิสิต (สมมติ)"
				bind:value={studentId}
				required
			/>
			<Button
				type="submit"
				class="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				onclick={() =>
					authClient.signUp.email({
						email: `${studentId}@student.chula.ac.th.mock`, // สมมติอีเมลนิสิต
						password: 'password1234',
						name: 'นิสิตสมมติ'
					})}
			>
				เข้าสู่ระบบ
			</Button>
		</form>
	{/if}
</main>

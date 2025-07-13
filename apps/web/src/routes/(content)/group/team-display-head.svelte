<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Student, Team, TeamMember } from '$lib/type';
	import Bubbles from './bubbles.svelte';

	interface Props {
		team: Team;
	}

	let { team }: Props = $props();

	const member: TeamMember[] = $derived([team.owner, ...team.members]);
</script>

<div
	class="flex w-full max-w-96 flex-col items-center justify-between gap-3 rounded-md bg-neutral-300 p-5 md:h-72 md:max-w-full md:flex-row md:gap-0"
>
	<div class="flex max-w-80 flex-col self-stretch">
		<h3 class="text-2xl font-medium">สร้างก๊วนมาอยู่ด้วยกัน</h3>
		<p class="mt-2 h-12 leading-5">
			ใคร ๆ ก็อยากเป็นหัวแถว ส่งโค้ดนี้ให้เพื่อนเพื่อเชิญเพื่อนเข้าทีมเลย!
		</p>
		<div class="mt-4 flex flex-wrap items-center gap-4">
			<code class="text-5xl tracking-[0.2em]">594F</code>
			<Button variant="secondary" class="bg-neutral-400/60 hover:bg-neutral-400/40"
				>สร้างใหม่</Button
			>
		</div>
		<div class="min-h-8 flex-1"></div>
		<p class="mb-1">หรือถ้าน้องอินโทรเวิร์ด ไม่ต้องส่งให้ใครก็ได้นะ</p>
	</div>
	<Bubbles {member} />
	<div class="self-stretch md:self-end">
		<h3 class="text-xl font-medium">สมาชิกปัจจุบัน</h3>
		<ul class="mt-2 leading-6">
			<li>{member[0].nickname} {member[0].department} (หัวห้อง)</li>
			{#each member.slice(1) as m}
				<li>
					{m.nickname}
					{m.department}
					<Button variant="secondary" class="h-6 pb-1" size="sm">ลบ</Button>
				</li>
			{/each}
		</ul>
	</div>
</div>

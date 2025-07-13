<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getDisplayName } from '$lib/idk';
	import type { Student, Team, TeamMember } from '$lib/type';
	import Bubbles from './bubbles.svelte';
	import MemberList from './member-list.svelte';

	interface Props {
		team: Team;
	}

	let { team }: Props = $props();

	let groups = [
		{
			name: 'miorine',
			number: 1
		},
		{
			name: 'sulleta',
			number: 2
		}
	];
</script>

joined {team.id}

<div
	class="flex w-full max-w-96 flex-col items-center justify-between gap-3 rounded-md bg-neutral-300 p-5 md:h-72 md:max-w-full md:flex-row md:gap-0"
>
	<div class="flex max-w-80 flex-col self-stretch">
		<h3 class="text-2xl font-medium">คุณอยู่กับ {getDisplayName(team.owner)}!</h3>
		<p class="mt-2 leading-5">
			{getDisplayName(team.owner)} สามารถแก้ไข การเรียงลำดับได้แค่คนเดียว งั้นเราไปคุยกับ{getDisplayName(
				team.owner
			)}
			เรื่องการจัดลำดับใหม่กันอีกทีนะ-!
		</p>
		<div class="min-h-8 flex-1"></div>
		<div class="mt-4 flex flex-col gap-2">
			<p>ทะเลาะกันหรือเปล่า?</p>
			<Button variant="secondary" class="bg-neutral-400/60 hover:bg-neutral-400/40"
				>ออกจากทีมนี้</Button
			>
		</div>
	</div>
	<Bubbles member={[team.owner, ...team.members]} />
	<MemberList {team} />
</div>

<section class="mt-8">
	<h2 class="text-2xl font-medium">ที่{getDisplayName(team.owner)} เรียงไว้ตอนนี้</h2>
	<div class="mt-2 flex flex-col gap-1">
		{#each groups as group (group.number)}
			<div class="flex w-full items-center justify-between bg-neutral-300 p-4">
				{group.name} ดาวพุธ
			</div>
		{/each}
	</div>
</section>

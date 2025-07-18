<script lang="ts">
	import { invalidate } from '$app/navigation';
	import BackButton from '$lib/components/back-button.svelte';
	import { trpcClient } from '$lib/trpc';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';
	import GroupSelector from './group-selector.svelte';
	import TeamDisplayHead from './team-display-head.svelte';
	import TeamDisplayMember from './team-display-member.svelte';
	import TeamDisplaySingle from './team-display-single.svelte';

	let { data }: PageProps = $props();
	const trpc = trpcClient();

	async function updateOrdering(preferences: number[]) {
		await trpc.team.updateGroupPreference.mutate(preferences);
		await invalidate('data:owned-team');
	}

	async function joinTeam(teamCodes: string) {
		const code = await trpc.team.join.mutate(teamCodes);
		if (code === 'ok') {
			await invalidate('data:joined-team');
		}

		if (code === 'is-owner') {
			toast.error('อยู่ในทีมอยู่แล้ว');
		}

		if (code === 'team-full') {
			toast.error('ทีมเต็มแล้ว');
		}

		if (code === 'team-not-founded') {
			toast.error('ไม่พบทีมนี้');
		}

		return code === 'ok';
	}

	async function regenerateTeamCodes() {
		await trpc.team.regenerateTeamCode.mutate();
		await invalidate('data:owned-team');
	}

	async function kickMember(email: string) {
		await trpc.team.kickOwnedTeamMemeber.mutate(email);
		await invalidate('data:owned-team');
	}

	async function leaveTeam() {
		await trpc.team.leaveJoinedTeam.mutate();
		await invalidate('data:joined-team');
	}
</script>

<nav class="flex items-center justify-between gap-4">
	<BackButton href="/menu" />
	<div class="text-center">
		<h1 class="text-3xl font-medium">เลือกกรุ๊ป</h1>
		<!-- <p class="text-zinc-700">เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน</p> -->
	</div>
	<div class="w-10"></div>
</nav>

<section class="mt-12">
	<h2 class="text-xl font-semibold">พาเพื่อนเข้ากลุ่มด้วยกัน</h2>
	<p>น้อง ๆ สามารถเชิญเพื่อนอีก 2 คน (รวมน้องเป็น 3) โดยจะโดนจัดให้อยู่กรุ๊ปเดียวกัน</p>

	<!-- <TeamDisplayMember {leaveTeam} team={data.ownedTeam} /> -->
	<!-- <TeamDisplayHead {regenerateTeamCodes} {kickMember} team={data.ownedTeam} /> -->
	{#if data.joinedTeam}
		<TeamDisplayMember {leaveTeam} team={data.joinedTeam} groupData={data.groupData} />
	{:else if data.ownedTeam.members.length > 0}
		<TeamDisplayHead {regenerateTeamCodes} {kickMember} team={data.ownedTeam} />
	{:else}
		<TeamDisplaySingle {regenerateTeamCodes} {joinTeam} team={data.ownedTeam} />
	{/if}
</section>

{#if !data.joinedTeam}
	<section class="mt-12">
		<h2 class="text-xl font-semibold">เรียงลำดับ</h2>
		<p>
			ลากแต่ละกล่องตามลำดับที่ต้องการ หากน้องเข้ากลุ่มกับเพื่อน อันดับนี้จะถูกยกเลิก
			และจะแสดงอันดับที่คนเชิญน้องเลือกไว้แทน
		</p>

		<GroupSelector preferences={data.ownedTeam.groupPreferenceOrder} save={updateOrdering} groupData={data.groupData} />
	</section>
{/if}

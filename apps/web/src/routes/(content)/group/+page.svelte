<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { PageProps } from './$types';
	import GroupSelector from './group-selector.svelte';
	import TeamDisplayHead from './team-display-head.svelte';
	import TeamDisplayMember from './team-display-member.svelte';
	import TeamDisplaySingle from './team-display-single.svelte';

	let { data }: PageProps = $props();

	async function saveOrdering() {}
</script>

<nav class="flex items-center justify-between gap-4">
	<BackButton href="/menu" />
	<div class="text-center ">
		<h1 class="text-3xl font-medium">เลือกกรุ๊ป</h1>
		<!-- <p class="text-zinc-700">เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน</p> -->
	</div>
	<div class="w-10"></div>
</nav>

<section class="mt-12">
	<h2 class="text-xl font-semibold">พาเพื่อนเข้ากลุ่มด้วยกัน</h2>
	<p>น้อง ๆ สามารถเชิญเพื่อนอีก 2 คน (รวมน้องเป็น 3) โดยจะโดนจัดให้อยู่กรุ๊ปเดียวกัน</p>

	<!-- <TeamDisplayMember team={data.ownedTeam} /> -->
	{#if data.joinedTeam}
		<TeamDisplayMember team={data.joinedTeam} />
	{:else if data.ownedTeam.members.length > 0}
		<TeamDisplayHead team={data.ownedTeam} />
	{:else}
		<TeamDisplaySingle team={data.ownedTeam} />
	{/if}
</section>

{#if !data.joinedTeam}
	<section class="mt-12">
		<h2 class="text-xl font-semibold">เรียงลำดับ</h2>
		<p>
			ลากแต่ละกล่องตามลำดับที่ต้องการ หากน้องเข้ากลุ่มกับเพื่อน อันดับนี้จะถูกยกเลิก
			และจะแสดงอันดับที่คนเชิญน้องเลือกไว้แทน
		</p>

		<GroupSelector />
	</section>

	<section class="mt-12">
		<p class="">
			หลังจากกดบันทึก น้องสามารกกลับมาแก้ไขเพื่อเชิญเพื่อนและแก้อันดับที่เลือกได้ จนกว่าจะ 24:00 น.
			ของวันที่ 21 กรกฎาคม เมื่อพ้นไปแล้วจะบันทึกตามข้อมูลปัจจุบันอัตโนมัติ
		</p>
		<Button size="lg" class="text-md mt-4 h-12 w-full ">บันทึกลำดับ</Button>
	</section>
{/if}

<script lang="ts">
	import BackButton from '$lib/components/back-button.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Bubbles from '../group/bubbles.svelte';
	import MemberList from '../group/member-list.svelte';
	import OpenChatIcon from './open-chat-icon.svelte';

	let { data } = $props();
	const team = $derived(data.joinedTeam ?? data.ownedTeam);
	const group = $derived(data.groupData.find((it) => it.number === data.groupResult));
</script>

<main class="container mx-auto flex h-full max-w-[60rem] flex-col px-5 py-14">
	<nav class="flex items-center justify-between gap-4">
		<BackButton href="/menu" />
		<div class="text-center">
			<h1 class="text-3xl font-medium">ประกาศผลกรุ๊ป</h1>
		</div>
		<div class="w-10"></div>
	</nav>

	<section class="mt-12">
		<h2 class="text-xl font-semibold">กรุ๊ปที่ได้</h2>
		<p>โชคชะตากำหนดให้คุณได้อยู่กรุ๊ป...</p>

		<div class="mt-3 flex w-full flex-col justify-between gap-6 rounded-2xl bg-white p-5 shadow-md">
			<div>
				<h2 class="text-3xl">{group?.name}</h2>
				<p>กรุ๊ป {group?.number}</p>
			</div>
			<p class="mt-3 text-gray-600">
				<strong>ขั้นต่อไป:</strong> อย่าลืมเข้าโอเพนแชทเพื่อพบปะเพื่อนใหม่ในกรุ๊ปนะ!
			</p>
			<Button
				href={group?.link}
				variant="secondary"
				class="bg-green-500 text-white hover:bg-green-500/90"
			>
				<OpenChatIcon />
				เข้าร่วมโอเพนแชท
			</Button>
		</div>
	</section>

	{#if true}
		<section class="mt-12">
			<h2 class="text-xl font-semibold">เพื่อนที่เข้ากลุ่มด้วยกัน</h2>
			<p>กลุ่มเพื่อน 2-3 คนที่เชิญไว้ก่อนหน้านี้</p>
		</section>
		<div
			class="mt-3 flex w-full flex-col items-center justify-around gap-12 rounded-2xl bg-white p-5 pb-6 shadow-md md:flex-row md:gap-3"
		>
			<Bubbles member={[team.owner, ...team.members]} />
			<div class="self-stretch">
				<MemberList {team} done={true} />
			</div>
		</div>
	{/if}
</main>

<script lang="ts">
	import { TaskCard, TaskSection, FestivalHeader } from '$lib/components/festival';
	import { flags } from '$lib/flags';
	import { getDisplayName } from '$lib/text-shuffle.svelte';
	import { FileUser, ListOrdered, Megaphone, Swords } from 'lucide-svelte';

	import MobileBGImage from '$lib/assets/640x1137px/640_1137w_bg.png';
	import TablateBGImage from '$lib/assets/768x1024px/768_1024w_bg.png';
	import DesktopBGImage from '$lib/assets/2048x1152px/2048_1152w_bg.png';

	let { data } = $props();
	const friends = $derived(
		data.team
			? [...data.team.members, data.team.owner]
					.filter((it) => it.email !== data.whoami.email)
					.map((it) => getDisplayName(it))
			: null
	);
</script>

<div
	class="justify-top fixed inset-0 -z-10 container mx-auto h-full w-full items-start overflow-hidden bg-[#F0CE7D]"
>
	<img
		srcset="{MobileBGImage} 640w, {TablateBGImage} 768w, {DesktopBGImage} 1440w"
		src={DesktopBGImage}
		alt=""
		class="h-full w-full object-cover object-top"
	/>
</div>
<main class="container mx-auto flex h-full w-full flex-col">
	<FestivalHeader />
	<div class="mt-6 flex flex-col gap-7 sm:p-3">
		<TaskSection subtitle="19 &ndash; 21 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('registering')}
				href="/register"
				title="ลงทะเบียนก่อนเข้าร่วมกิจกรรม"
				description="บอกเราหน่อยว่าคุณเป็นใคร"
				status={data.isRegistered ? 'ดำเนินการแล้ว' : 'ยังไม่ดำเนินการ'}
				icon={FileUser}
			/>
			<TaskCard
				disabled={!flags.isEnabled('group-choosing')}
				href="/group"
				title="เรียงลำดับกรุ๊ปที่ชื่นชอบ"
				description="เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน"
				status={!friends
					? 'ทำตามขั้นตอนข้างบนก่อน'
					: `${friends.length !== 0 ? 'จับกลุ่มกับ ' : ''}${friends.join(
							' และ '
						)} ที่เรียงไว้คือ ${data.team!.groupPreferenceOrder.join(' ')}`}
				icon={ListOrdered}
			/>
		</TaskSection>
		<TaskSection subtitle="22 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('group-announcement')}
				href="/group"
				title="ประกาศผลกรุ๊ป"
				description="ประกาศผลกรุ๊ปที่น้อง ๆ จะได้เป็นสมาชิกตลอดกิจกรรม"
				status={!flags.isEnabled('group-announcement')
					? 'ประกาศภายในวันที่ 22 กรกฎาคม'
					: 'ประกาศผลแล้ว'}
				icon={Megaphone}
			/>
		</TaskSection>
		<TaskSection subtitle="26 &ndash; 29 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('game-playing')}
				href="/game"
				title="เกมสุดพิเศษล่าความภูมิใจและศักดิ์ศรี"
				description="เล่นได้ในวันที่ 26 กรกฎาคม"
				status="ยังไม่เปิด"
				icon={Swords}
			/>
		</TaskSection>
	</div>
</main>

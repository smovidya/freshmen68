<script>
	import { TaskCard, TaskSection, FestivalHeader } from '$lib/components/festival';
	import { flags } from '$lib/flags';
	import { FileUser, Lock, Megaphone, Swords } from 'lucide-svelte';
</script>

<main class="container mx-auto flex h-full w-full flex-col px-5 py-14">
	<FestivalHeader />
	<div class="flex flex-col gap-7 p-3">
		<TaskSection subtitle="19 &ndash; 21 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('registering')}
				href="/register"
				title="ลงทะเบียนก่อนเข้าร่วมกิจกรรม"
				description="บอกเราหน่อยว่าคุณเป็นใคร"
				icon={FileUser}
			/>
			<TaskCard
				disabled={!flags.isEnabled('group-choosing')}
				href="/group"
				title="เรียงลำดับกรุ๊ปที่ชื่นชอบ"
				description="เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน"
				icon={Lock}
			/>
		</TaskSection>
		<TaskSection subtitle="22 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('group-announcement')}
				href="/group"
				title="ประกาศผลกรุ๊ป"
				description="ประกาศผลกรุ๊ปที่น้อง ๆ จะได้เป็นสมาชิกตลอดกิจกรรม"
				icon={Megaphone}
			/>
		</TaskSection>
		<TaskSection subtitle="26 &ndash; 19 กรกฎาคม">
			<TaskCard
				disabled={!flags.isEnabled('game-start')}
				href="/group"
				title="เกมสุดพิเศษล่าความภูมิใจและศักดิ์ศรี"
				description="เล่นได้ในวันที่ 26 กรกฎาคม"
				icon={Swords}
			/>
		</TaskSection>
	</div>
</main>

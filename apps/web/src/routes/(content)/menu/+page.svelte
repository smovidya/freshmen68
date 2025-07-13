<script>
	import { TaskCard, TaskSection, FestivalHeader } from '$lib/components/festival';
	import { FileUser } from 'lucide-svelte';
</script>

<main class="container mx-auto flex h-full w-full flex-col px-5 py-14">
	<FestivalHeader />
	<div class="flex flex-col gap-7 p-3">
		<TaskSection subtitle="19 &ndash; 21 กรกฎาคม">
			<TaskCard
				href="/register"
				title="ลงทะเบียนก่อนเข้าร่วมกิจกรรม"
				description="บอกเราหน่อยว่าคุณเป็นใคร"
				icon={FileUser}
			/>
			<TaskCard
				href="/group"
				title="เรียงลำดับกรุ๊ปที่ชื่นชอบ"
				description="เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน"
				icon="lock"
			/>
		</TaskSection>
		<TaskSection subtitle="22 กรกฎาคม">
			<TaskCard
				href="/group"
				title="ประกาศผลกรุ๊ป"
				description="บอกเราหน่อยว่าคุณเป็นใคร"
				icon="file-user"
			/>
		</TaskSection>
		<TaskSection subtitle="26 &ndash; 19 กรกฎาคม">
			<TaskCard
				href="/group"
				title="เกมสุดพิเศษล่าความภูมิใจและศักดิ์ศรี"
				description="เล่นได้ในวันที่ 26 กรกฎาคม"
				icon="file-user"
			/>
		</TaskSection>
	</div>
</main>

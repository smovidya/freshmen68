<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import TeamDisplay from './team-display.svelte';
	import GroupSelector from './group-selector.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	async function save() {

	}
</script>

<h1 class="mt-6 text-center text-5xl">สุ่มกรุ๊ปที่นี่</h1>

<section class="mt-8">
	<h2 class="text-xl font-medium">พาเพื่อนเข้ากลุ่มด้วยกัน</h2>
	<p>น้อง ๆ สามารถเชิญเพื่อนอีก 2 คน (รวมน้องเป็น 3) โดยจะโดนจัดให้อยู่กรุ๊ปเดียวกัน</p>

	<TeamDisplay />
</section>

<section class="mt-6">
	<h2 class="text-xl font-medium">เรียงลำดับ</h2>
	<p>
		ลากแต่ละกล่องตามลำดับที่ต้องการ หากน้องเข้ากลุ่มกับเพื่อน อันดับนี้จะถูกยกเลิก
		และจะแสดงอันดับที่คนเชิญน้องเลือกไว้แทน
	</p>

	<GroupSelector />
</section>

<section class="mt-8">
	<p class="">
		หลังจากกดบันทึก น้องสามารกกลับมาแก้ไขเพื่อเชิญเพื่อนและแก้อันดับที่เลือกได้ จนกว่าจะ 24:00 น.
		ของวันที่ 21 กรกฎาคม เมื่อพ้นไปแล้วจะบันทึกตามข้อมูลปัจจุบันอัตโนมัติ
	</p>
	<Button variant="secondary" size="lg" class="mt-4 w-full bg-neutral-300 hover:bg-neutral-300/90"
		>บันทึก</Button
	>
</section>

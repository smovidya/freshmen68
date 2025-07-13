<script>
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<main
	class="container mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center gap-4 px-4 py-16"
>
	<h1 class="text-center text-2xl font-bold">
		เทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์<br />จุฬาลงกรณ์มหาวิทยาลัย
	</h1>
	<div class="flex flex-col gap-10 p-5">
		<section class="flex flex-col items-center">
			<span class="mb-2 text-sm">19 &ndash; 21 กรกฎาคม</span>
			<div class="flex flex-col gap-5 rounded-2xl bg-yellow-50/70 p-4 shadow-md backdrop-blur-lg">
				<a href="/register" class="flex flex-row items-center gap-4">
					<div
						class="mr-2 flex size-20 shrink-0 flex-row items-center justify-center rounded-full bg-white align-middle"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-file-user-icon lucide-file-user size-7"
							><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M15 18a3 3 0 1 0-6 0" /><path
								d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"
							/><circle cx="12" cy="13" r="2" /></svg
						>
					</div>
					<div class="w-full">
						<h2 class="text-xl font-bold mb-1">ลงทะเบียนก่อนเข้าร่วมกิจกรรม</h2>
						<p class="text-sm">บอกเราหน่อยว่าคุณเป็นใคร</p>
						<span class="text-sm"> ยังไม่ดำเนินการ </span>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-chevron-right-icon lucide-chevron-right m-4 size-5 shrink-0"
						><path d="m9 18 6-6-6-6" /></svg
					>
				</a>
				<a href="/register" class="flex flex-row items-center gap-4">
					<div
						class="mr-2 flex size-16 shrink-0 flex-row items-center justify-center rounded-full bg-white align-middle"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-lock-icon lucide-lock size-7"
							><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path
								d="M7 11V7a5 5 0 0 1 10 0v4"
							/></svg
						>
					</div>
					<div class="w-full">
						<h2 class="mb-1 text-xl font-bold">เรียงลำดับกรุ๊ปที่ชื่นชอบ</h2>
						<p class="text-sm">
							เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน
						</p>
						<span class="text-sm"> ยังไม่ดำเนินการ </span>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-chevron-right-icon lucide-chevron-right m-4 size-5 shrink-0"
						><path d="m9 18 6-6-6-6" /></svg
					>
				</a>
			</div>
		</section>
	</div>
</main>

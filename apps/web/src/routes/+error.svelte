<script lang="ts">
	import { page } from '$app/state';
	import BackButton from '$lib/components/back-button.svelte';
	import '@fontsource-variable/noto-sans-thai';
	import '../app.css';
</script>

<svelte:head>
	<title>เทศกาลต้อนรับนิสิตใหม่ คณะวิทย์จุฬา</title>
</svelte:head>

<div class="container mx-auto flex min-h-screen max-w-[60rem] flex-col px-5 py-14">
	<nav class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <BackButton href="/menu" />
      <a href="/menu" class="hover:underline underline-offset-2">กลับ</a>
    </div>
		<div class="text-center">
			<!-- <p class="text-zinc-700">เรียงลำดับกรุ๊ปรับน้องตามที่น้อง ๆ สนใจ พร้อมจับมือเพื่อนไปด้วยอีก 2 คน</p> -->
		</div>
		<div class="w-10"></div>
	</nav>

  <div class="flex-1 flex flex-col gap-2 justify-center items-center">
    <h1 class="text-5xl">
      {page.status}
    </h1>
    <p class="text-lg">
      {page.error?.message}
    </p>
  </div>
</div>

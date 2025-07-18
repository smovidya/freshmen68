<script lang="ts">
	import SunImage from '$lib/assets/sun.svg';
	import RightCloud6Image from '$lib/assets/right-cloud6.png';
	import FloatingElements from './floating-elements.svelte';
	import DevLoginBox from './dev-login-box.svelte';
	import { dev } from '$app/environment';
	import LoginWithGoogle from './login-with-google.svelte';
</script>

<main class="relative container mx-auto flex min-h-screen flex-col items-center justify-center">
	<FloatingElements />
	<div class="z-10 mx-auto flex min-h-screen flex-col items-center justify-center">
		<div>
			<img src={SunImage} alt="Sun" class="mb-4 size-32" />
		</div>
		<div class="mt-5 flex flex-col items-center">
			<h1 class="text-center text-2xl font-bold">
				เทศกาลต้อนรับนิสิตใหม่ คณะวิทยาศาสตร์<br />จุฬาลงกรณ์มหาวิทยาลัย
			</h1>
			{#if dev}
				<DevLoginBox />
			{/if}
			<LoginWithGoogle class="mt-4" />
			<img src={RightCloud6Image} height={50} alt="Right Cloud" class="mt-4 h-10" />
		</div>
	</div>
</main>

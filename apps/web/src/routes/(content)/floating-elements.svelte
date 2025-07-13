<script lang="ts">
	import LeftCloud1Image from '$lib/assets/left-cloud1.png';
	import LeftCloud2Image from '$lib/assets/left-cloud2.png';
	import LeftCloud3Image from '$lib/assets/left-cloud3.png';
	import LeftCloud4Image from '$lib/assets/left-cloud4.png';
	import LeftCloud5Image from '$lib/assets/left-cloud5.png';
	import LeftCloud6Image from '$lib/assets/left-cloud6.png';
	import LeftMt1Image from '$lib/assets/left-mt1.png';
	import LeftMt2Image from '$lib/assets/left-mt2-5.png';
	import RightCloud1Image from '$lib/assets/right-cloud1.png';
	import RightCloud2Image from '$lib/assets/right-cloud2.png';
	import RightCloud3Image from '$lib/assets/right-cloud3.png';
	import RightCloud4Image from '$lib/assets/right-cloud4.png';
	import RightCloud5Image from '$lib/assets/right-cloud5.png';
	import RightMt1Image from '$lib/assets/right-mt1.png';
	import RightMt2Image from '$lib/assets/right-mt2-3.png';

	// create a parallax per mouse movement effect
	import { onMount } from 'svelte';
</script>

<div class="fixed inset-0 z-10 h-auto w-screen min-w-[720px]">
	<div class="absolute inset-0 flex w-full items-end justify-start">
		<img
			src={LeftMt1Image}
			alt=""
			class="absolute w-full max-w-[1240px]"
			style="--order: 0; --duration: -2.5"
		/>
		<img src={LeftCloud1Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 1;" />
		<img src={LeftCloud2Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 2;" />
		<img src={LeftCloud3Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 3;" />
		<img src={LeftCloud4Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 4;" />
		<img src={LeftCloud5Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 5;" />
		<img
			src={LeftMt2Image}
			alt=""
			class="absolute w-full max-w-[1240px]"
			style="--order: 0; --duration: -2.5"
		/>
		<img src={LeftCloud6Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 6;" />
	</div>
	<div class="absolute inset-0 flex items-end justify-end">
		<img
			src={RightMt1Image}
			alt=""
			class="absolute w-full max-w-[1240px]"
			style="--order: 0; --duration: -2.5"
		/>
		<img src={RightCloud1Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 1;" />
		<img src={RightCloud2Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 2;" />
		<img src={RightCloud3Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 3;" />
		<img
			src={RightMt2Image}
			alt=""
			class="absolute w-full max-w-[1240px]"
			style="--order: 0; --duration: -2.5"
		/>
		<img src={RightCloud4Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 4;" />
		<img src={RightCloud5Image} alt="" class="absolute w-full max-w-[1240px]" style="--order: 5;" />
	</div>
</div>

<style>
	img {
		/* animate slide in */
		animation: fadeIn calc(var(--duration, 0) * 1s + 2s) ease-in-out forwards;
		animation-delay: calc(var(--order, 0) * 0.5s);
		animation-fill-mode: forwards;
		opacity: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(50px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>

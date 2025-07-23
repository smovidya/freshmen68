<script lang="ts">
	// apps/web/src/lib/assets/game/g1_close_withEff.PNG apps/web/src/lib/assets/game/g1_close.PNG apps/web/src/lib/assets/game/g1_open_withEff.PNG apps/web/src/lib/assets/game/g1_open.PNG apps/web/src/lib/assets/game/g3_close_withEff.PNG apps/web/src/lib/assets/game/g3_close.PNG apps/web/src/lib/assets/game/g3_open_withEff.PNG apps/web/src/lib/assets/game/g3_open.PNG apps/web/src/lib/assets/game/g4_close_withEff.PNG apps/web/src/lib/assets/game/g4_close.PNG apps/web/src/lib/assets/game/g4_open_withEff.PNG apps/web/src/lib/assets/game/g4_open.PNG apps/web/src/lib/assets/game/g5_close_withEff.PNG apps/web/src/lib/assets/game/g5_close.PNG apps/web/src/lib/assets/game/g5_open_withEff.PNG apps/web/src/lib/assets/game/g5_open.PNG apps/web/src/lib/assets/game/g6_close.PNG apps/web/src/lib/assets/game/g6_open.PNG apps/web/src/lib/assets/game/g7_close_withEff.PNG apps/web/src/lib/assets/game/g7_close.PNG apps/web/src/lib/assets/game/g7_open_withEff.PNG apps/web/src/lib/assets/game/g7_open.PNG
	import G1CloseWithEff from '$lib/assets/game/g1_close_withEff.png';
	import G1OpenWithEff from '$lib/assets/game/g1_open_withEff.png';
	import G3CloseWithEff from '$lib/assets/game/g3_close_withEff.png';
	import G3OpenWithEff from '$lib/assets/game/g3_open_withEff.png';
	import G4CloseWithEff from '$lib/assets/game/g4_close_withEff.png';
	import G4OpenWithEff from '$lib/assets/game/g4_open_withEff.png';
	import G5CloseWithEff from '$lib/assets/game/g5_close_withEff.png';
	import G5OpenWithEff from '$lib/assets/game/g5_open_withEff.png';
	import G6Close from '$lib/assets/game/g6_close.png';
	import G6Open from '$lib/assets/game/g6_open.png';
	import G7CloseWithEff from '$lib/assets/game/g7_close_withEff.png';
	import G7OpenWithEff from '$lib/assets/game/g7_open_withEff.png';
	import PopSound from '$lib/assets/game/pop-cat-original-meme_3ObdYkj.mp3';

	let popSound: HTMLAudioElement;

	const popImages = {
		g1: {
			close: G1CloseWithEff,
			open: G1OpenWithEff
		},
		g3: {
			close: G3CloseWithEff,
			open: G3OpenWithEff
		},
		g4: {
			close: G4CloseWithEff,
			open: G4OpenWithEff
		},
		g5: {
			close: G5CloseWithEff,
			open: G5OpenWithEff
		},
		g6: {
			close: G6Close,
			open: G6Open
		},
		g7: {
			close: G7CloseWithEff,
			open: G7OpenWithEff
		}
	};

	const groupImageKey = ['g1', 'g3', 'g4', 'g5', 'g6', 'g7'][Math.floor(Math.random() * 6)];

	let poping = $state(false);

	function onPop() {
		poping = true;
		setTimeout(() => {
			poping = false;
		}, 250); // Adjust the duration as needed
	}

	function onUnpop() {
		// TODO: Make sound smoother
		popSound.play();
	}
</script>

<svelte:window
	onkeydown={(event) => {
		onPop();
	}}
	onkeyup={(event) => {
		onUnpop();
	}}
	onmousedown={(event) => {
		onPop();
	}}
	onmouseup={(event) => {
		onUnpop();
	}}
/>
<audio src={PopSound} bind:this={popSound} class="hidden"></audio>

<main class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<button
		class="size-56 select-none"
		onmousedown={onPop}
		onmouseup={onUnpop}
		ontouchstart={onPop}
		ontouchend={onUnpop}
		aria-label="Toggle Pop"
	>
		<div>
			<img
				src={popImages[groupImageKey].open}
				class={poping ? 'block' : 'hidden'}
				alt=""
				draggable="false"
			/>
			<img
				src={popImages[groupImageKey].close}
				class={poping ? 'hidden' : 'block'}
				alt=""
				draggable="false"
			/>
		</div>
	</button>
</main>

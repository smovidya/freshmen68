<script lang="ts">
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
	import { GameAPIClient, GamePopper } from '$lib/game.svelte';
	import { onMount } from 'svelte';

	import {
		Drawer,
		DrawerContent,
		DrawerFooter,
		DrawerHeader,
		DrawerTitle,
		DrawerTrigger
	} from '$lib/components/ui/drawer';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { when } from '$lib/reacitivity.svelte';

	let {
		studentGroup = $bindable('1'),
		studentOuid = $bindable(''),
		client
	}: { studentGroup: string; studentOuid: string; client: GameAPIClient } = $props();

	const popper = new GamePopper(client);

	let popSound: HTMLAudioElement;
	let gameData = $state<{
		leaderboard: Awaited<ReturnType<GameAPIClient['getGlobalLeaderboard']>>;
		inGroup: Awaited<ReturnType<GameAPIClient['getInGroupLeaderboard']>>;
	}>({
		leaderboard: {},
		inGroup: []
	});

	// function setLocalStorageWithDate(key: string, value: any, expirationMinutes: number = 20) {
	// 	if (value?.error) {
	// 		localStorage.removeItem(key);
	// 		return;
	// 	}
	// 	const data = {
	// 		value,
	// 		date: new Date().toISOString(),
	// 		exp: new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString()
	// 	};
	// 	localStorage.setItem(key, JSON.stringify(data));
	// }

	// function getLocalStorageWithDate<T>(key: string): T | null {
	// 	const data = localStorage.getItem(key);
	// 	if (!data) return null;
	// 	const parsedData = JSON.parse(data);
	// 	if (parsedData?.value?.error) {
	// 		localStorage.removeItem(key);
	// 		return null;
	// 	}
	// 	const date = new Date(parsedData.date);
	// 	const now = new Date();
	// 	const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
	// 	if (diffInMinutes > parsedData.exp) {
	// 		localStorage.removeItem(key);
	// 		return null;
	// 	}
	// 	return parsedData.value as T;
	// }

	const getLeaderboardGlobal = async () => {
		gameData.leaderboard = await client.getGlobalLeaderboard();
	};

	const getInGroupLeaderboard = async () => {
		gameData.inGroup = await client.getInGroupLeaderboard(studentGroup);
	};

	when(
		() => client.ready,
		() => {
			popper.init();
			getLeaderboardGlobal();
			getInGroupLeaderboard();
		}
	);

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
	} as Record<
		string,
		{
			close: string;
			open: string;
		}
	>;

	let poping = $state(false);
	let currentPopBatchCount = $state(0);
	let popTimeout: NodeJS.Timeout | null = null;
	let groupImageKey = 'g' + studentGroup;
	let myDisplayName = $state('');
	let isEditingName = $state(false);

	function onPop() {
		if (poping) return;
		poping = true;
		if (popTimeout) clearTimeout(popTimeout);
		popTimeout = setTimeout(() => {
			poping = false;
			popTimeout = null;
		}, 200);
	}

	function onUnpop() {
		if (!poping) return;
		poping = false;
		popper.pop();
		// TODO: Sound so shit I gotta disabled it
		// popSound.play();
	}

	onMount(() => {
		const id1 = setInterval(getInGroupLeaderboard, 1000 * 2);
		const id2 = setInterval(getLeaderboardGlobal, 1000 * 2);
		return () => {
			popper.destroy();
			clearInterval(id1);
			clearInterval(id2);
		};
	});
</script>

<svelte:window
	onkeydown={(event) => {
		onPop();
	}}
	onkeyup={(event) => {
		onUnpop();
	}}
/>

<audio src={PopSound} bind:this={popSound} class="hidden"></audio>

<div class="flex h-screen flex-col items-center justify-center bg-gray-100">
	<div class="mb-4 flex flex-col items-center text-2xl font-bold">
		<div>
			<div>
				{myDisplayName}
			</div>
			<div class="mb-4 text-center text-2xl font-bold">
				{currentPopBatchCount + popper.displaySelfCount}
			</div>
		</div>
		<button
			class="size-1/3 outline-none select-none focus:outline-none"
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
	</div>
	<div>
		<Drawer>
			<DrawerTrigger
				class={buttonVariants({
					variant: 'outline'
				})}
			>
				สถิติเกม
			</DrawerTrigger>

			<DrawerContent class="mx-auto max-w-2xl px-5">
				<DrawerHeader>
					<DrawerTitle>สถิติเกม</DrawerTitle>
				</DrawerHeader>
				<div class="flex h-fit max-h-[80vh] min-h-[50vh] flex-col items-center justify-start gap-4">
					<Tabs value="all" class="w-full">
						<TabsList>
							<TabsTrigger value="all">ทุกกรุ๊ป</TabsTrigger>
							<TabsTrigger value="mygroup">
								กรุ๊ป {studentGroup}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="all">
							{#each Object.entries(gameData.leaderboard) as [groupName, score]}
								<div class="flex items-center justify-between border-b p-2">
									<span>{groupName}</span>
									<span>{score}</span>
								</div>
							{/each}
						</TabsContent>
						<TabsContent class="p-3" value="mygroup">
							<div class="flex flex-col items-center">
								<div class="mb-2 text-lg font-semibold">กรุ๊ป {studentGroup}</div>
								<p>คะแนนสูงสุด 10 อันดับในกรุ๊ปของคุ้ณณณณณ</p>
								{#if gameData.inGroup.length > 0}
									<div class="w-full">
										{#each gameData.inGroup as { playerId, score, player_name }}
											<div class="flex items-center justify-between border-b p-2">
												<div>
													{#if playerId === studentOuid && isEditingName}
														<div class="flex items-center gap-2">
															<Input
																bind:value={myDisplayName}
																placeholder="ชื่อของคุณ"
																class="w-32"
															/>
															<Button
																variant="outline"
																onclick={async () => {
																	isEditingName = false;
																	client.updateName(myDisplayName);
																	gameData.inGroup =
																		await client.getInGroupLeaderboard(studentGroup);
																}}
															>
																บันทึก
															</Button>
														</div>
													{:else if playerId === studentOuid}
														<div>
															<span class="font-bold">{player_name}</span>
															<Button
																variant="outline"
																onclick={() => {
																	isEditingName = true;
																}}
															>
																แก้ไขชื่อ
															</Button>
														</div>
													{:else}
														<div>
															{player_name || playerId}
														</div>
													{/if}
												</div>
												<span>{score}</span>
											</div>
										{/each}
									</div>
								{:else}
									<div class="text-gray-500">ไม่มีข้อมูล</div>
								{/if}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</DrawerContent>
		</Drawer>
	</div>
</div>

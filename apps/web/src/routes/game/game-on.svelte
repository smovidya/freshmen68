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
		DrawerHeader,
		DrawerTitle,
		DrawerTrigger
	} from '$lib/components/ui/drawer';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import { when } from '$lib/reacitivity.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { browser } from '$app/environment';
	import NumberFlow from '@number-flow/svelte';

	let {
		studentGroup = $bindable('1'),
		studentOuid = $bindable(''),
		client
	}: { studentGroup: string; studentOuid: string; client: GameAPIClient } = $props();

	const popper = new GamePopper(client);

	let popSound: HTMLAudioElement;
	let leaderboard: Awaited<ReturnType<GameAPIClient['getLeaderboard']>> = $state([]);
	const inGroupLeaderboard = $derived(
		leaderboard.find((it) => it.groupNumber === studentGroup)?.leaderboard ?? []
	);

	const getLeaderboard = async () => {
		leaderboard = await client.getLeaderboard();
	};

	when(
		() => client.ready,
		() => {
			popper.init();
			getLeaderboard();
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

	async function onUnpop(isCount = false) {
		if (!poping) return;
		poping = false;
		if (isCount) popper.pop();
		if (isCount && browser) {
			const audio = new Audio(PopSound);
			await audio.play().catch((error) => {
				console.error('Error playing sound:', error);
			});
		}
	}

	onMount(() => {
		const id1 = setInterval(getLeaderboard, 1000 * 3);
		return () => {
			popper.destroy();
			clearInterval(id1);
		};
	});

	function formatNumberToShorthand(num: number): string {
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'm';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
		return num.toString();
	}

	function formatLocalNum(num: number) {
		return num.toLocaleString();
	}
</script>

<svelte:window
	onkeydown={(event) => {
		onPop();
	}}
	onkeyup={(event) => {
		onUnpop(true);
	}}
/>

<!-- background image repeat -->
<div class="flex h-screen flex-col items-center justify-center">
	<div class="mb-4 flex flex-col items-center">
		<div class="flex flex-col items-center justify-center">
			<div>
				{popper.displayName}
			</div>
			<div class="mb-4 text-center text-2xl font-bold">
				<NumberFlow value={currentPopBatchCount + popper.displaySelfCount} />
			</div>
		</div>
		<button
			class="h-full min-h-64 w-full min-w-64 touch-manipulation rounded-lg bg-contain bg-center bg-no-repeat outline-none select-none focus:outline-none"
			onmousedown={onPop}
			onmouseup={() => onUnpop()}
			ontouchstart={() => onPop()}
			ontouchend={() => onUnpop()}
			onpointerdown={() => onPop()}
			onpointerup={() => onUnpop(true)}
			aria-label="Toggle Pop"
			style="background-image: url({poping
				? popImages[groupImageKey].open
				: popImages[groupImageKey].close});"
		>
			<span class="sr-only">Toggle Pop</span>
		</button>
	</div>
	<div>
		<Drawer>
			<DrawerTrigger
				onclick={async () => {
					isEditingName = false;
					myDisplayName = (await client.getName()) || '';
					getLeaderboard();
				}}
				class={buttonVariants({ variant: 'outline', class: 'h-auto rounded-2xl p-2' })}
			>
				<div class="flex flex-col items-center gap-1">
					<strong> อันดับ </strong>
					<div class="text-muted-foreground w-full rounded-md text-sm">กดเพื่อดูอันดับทั้งหมด</div>
					<div class="flex flex-row gap-2">
						<!-- 3 อันดับ -->
						{#each leaderboard
							.toSorted((a, b) => b.totalScore - a.totalScore)
							.slice(0, 3) as { groupNumber, totalScore }, i}
							<div class="flex flex-col gap-1 rounded-lg border p-2">
								<span class="">
									{#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{/if}
									แคว้น {groupNumber}</span
								>
								<span class="text-lg">
									{#if totalScore >= 1e6}
										<NumberFlow value={(totalScore / 1e6).toFixed(2)} />m
									{:else if totalScore >= 1e3}
										<NumberFlow value={(totalScore / 1e3).toFixed(2)} />k
									{:else}
										<NumberFlow value={totalScore} />
									{/if}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</DrawerTrigger>

			<DrawerContent class="mx-auto max-w-2xl px-5">
				<DrawerHeader>
					<DrawerTitle>สถิติเกม</DrawerTitle>
				</DrawerHeader>
				<div class="flex h-fit max-h-[80vh] min-h-[50vh] flex-col items-center justify-start gap-4">
					<Tabs value="all" class="w-full">
						<TabsList>
							<TabsTrigger value="all">ทุกแคว้น</TabsTrigger>
							<TabsTrigger value="mygroup">
								แคว้น {studentGroup}
							</TabsTrigger>
						</TabsList>
						<TabsContent value="all">
							{#each leaderboard.toSorted((a, b) => b.totalScore - a.totalScore) as { groupNumber, totalScore }, i}
								<div class="flex items-center justify-between border-b p-2">
									<span>
										{#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{/if}
										แคว้น {groupNumber}
									</span>
									<span>
										<NumberFlow value={totalScore} />
									</span>
								</div>
							{/each}
						</TabsContent>
						<TabsContent class="p-3" value="mygroup">
							<div class="flex flex-col items-center">
								<div class="mb-2 text-lg font-semibold">แคว้น {studentGroup}</div>
								<p>คะแนนสูงสุด 10 ผู้ขยันขันแข็งในแคว้นของคุณณณณ</p>
								{#if inGroupLeaderboard.length > 0}
									<div class="w-full">
										{#each inGroupLeaderboard as { playerId, score, player_name }, i}
											<div class="flex items-center justify-between border-b p-2">
												<div class="flex items-center gap-2">
													{#if i < 3}
														<span>
															{#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{/if}
														</span>
													{/if}
													{#if playerId === studentOuid}
														<Badge class="bg-yellow-200 text-yellow-800">คุณ</Badge>
													{/if}
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
																	await client.updateName(myDisplayName);
																	await getLeaderboard();
																}}
															>
																บันทึก
															</Button>
														</div>
													{:else if playerId === studentOuid}
														<div>
															<span class="font-bold">{player_name || studentOuid}</span>
															<Button
																variant="outline"
																onclick={() => {
																	isEditingName = true;
																}}
																size="sm"
															>
																แก้ไขชื่อคุณ
															</Button>
														</div>
													{:else}
														<div>
															{player_name || playerId}
														</div>
													{/if}
												</div>
												<span>
													<NumberFlow value={score} />
												</span>
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

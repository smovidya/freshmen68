<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import GripVertical from '@lucide/svelte/icons/grip-vertical';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';

	let items = $state([
		{ id: 1, name: 'item1' },
		{ id: 2, name: 'item2' },
		{ id: 3, name: 'item3' },
		{ id: 4, name: 'item4' }
	]);

	type Item = (typeof items)[number];

	const flipDurationMs = 300;
	function handleDndConsider(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Item>>) {
		items = e.detail.items;
	}

	function moveUp(id: number) {
		const index = items.findIndex((item) => item.id === id);
		if (index > 0) {
			const [item] = items.splice(index, 1);
			items.splice(index - 1, 0, item);
		}
	}

	function moveDown(id: number) {
		const index = items.findIndex((item) => item.id === id);
		if (index < items.length - 1) {
			const [item] = items.splice(index, 1);
			items.splice(index + 1, 0, item);
		}
	}
</script>

<section class="mt-4">
	<div
		class="flex flex-col gap-1.5"
		use:dndzone={{ items, flipDurationMs, dropTargetStyle: {} }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each items as item, index (item.id)}
			<div
				animate:flip={{ duration: flipDurationMs }}
				class="flex w-full items-center justify-between rounded-md bg-white p-4 shadow-md"
			>
				<div class="flex">
					{item.name} (แม่มดจาก)ดาวพุธ
				</div>
				<div class="flex items-center gap-2">
					<Button
						size="icon"
						variant="secondary"
						disabled={index === 0}
						onclick={() => moveUp(item.id)}
					>
						<ArrowUp />
					</Button>
					<Button
						size="icon"
						variant="secondary"
						disabled={index === items.length - 1}
						onclick={() => moveDown(item.id)}
					>
						<ArrowDown />
					</Button>
					<GripVertical />
				</div>
			</div>
		{/each}
	</div>
</section>

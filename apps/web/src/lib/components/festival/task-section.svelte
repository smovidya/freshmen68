<script lang="ts">
	const { subtitle, children } = $props();
</script>

<section class="flex w-full flex-col items-center">
	{#if subtitle}
		<span class="mb-2 text-sm text-gray-600">{subtitle}</span>
	{/if}

	<div
		class="flex w-full flex-col gap-5 rounded-2xl bg-yellow-50/70 p-4 shadow-md backdrop-blur-lg"
	>
		{@render children?.()}
	</div>
</section>

<script lang="ts">
	const { subtitle, children } = $props();
</script>

<section class="flex w-full flex-col items-center">
	{#if subtitle}
		<span
			class="text-shadow-[0_0_15px_var(--tw-text-shadow-color)] text-shadow-black mb-2 text-sm text-white"
			>{subtitle}</span
		>
	{/if}

	<div
		class="flex w-full flex-col gap-1 rounded-2xl p-1 shadow-md backdrop-blur-lg sm:bg-yellow-50/70"
	>
		{@render children?.()}
	</div>
</section>

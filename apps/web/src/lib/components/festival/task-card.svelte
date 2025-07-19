<script lang="ts">
	const {
		href,
		title,
		description,
		status = 'ยังไม่ดำเนินการ',
		icon = 'file-user',
		disabled = false
	}: {
		href: string;
		title: string;
		description: string;
		status?: string;
		icon?: any;
		disabled?: boolean;
	} = $props();

	const Icon = icon;
</script>

<a
	href={disabled ? undefined : href}
	data-sveltekit-preload-data="tap"
	class="flex flex-row items-center rounded-lg bg-white/60 sm:bg-white/10 p-4 transition-all hover:bg-white/50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 sm:gap-4"
	aria-disabled={disabled}
>
	<div
		class="mr-2 hidden size-20 shrink-0 flex-row items-center justify-center rounded-full bg-white/60 align-middle shadow-sm sm:flex"
	>
		<Icon class="size-12 stroke-1 text-red-600" />
	</div>
	<div class="w-full">
		<h2 class="mb-1 text-xl font-bold">{title}</h2>
		<p class="w-full text-sm text-gray-700">{description}</p>
		<span class="text-muted-foreground text-xs">{status}</span>
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
		class="lucide lucide-chevron-right m-4 size-7 shrink-0 text-gray-600"
	>
		<path d="m9 18 6-6-6-6" />
	</svg>
</a>

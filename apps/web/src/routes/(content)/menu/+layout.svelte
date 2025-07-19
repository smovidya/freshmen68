<script lang="ts">
	const { children } = $props();
</script>

<main class="container mx-auto flex h-full w-full flex-col px-5 py-14">
	{@render children()}
</main>

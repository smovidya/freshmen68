<script lang="ts">
	import '../../app.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-radial from-[#F7CF76] to-[#F7CF76]/30">
	{@render children()}
</div>

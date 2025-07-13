<script lang="ts">
	import '../../app.css';
	import '@fontsource-variable/noto-sans-thai';


	let { children } = $props();
</script>

<div class="min-h-screen bg-radial from-[#F7CF76] to-[#F7CF76]/30">
	{@render children()}
</div>

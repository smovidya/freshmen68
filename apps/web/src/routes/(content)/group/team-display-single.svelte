<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import type { Team } from '$lib/type';

	interface Props {
		team: Team;
	}

	let { team }: Props = $props();

	/// arggghhh, i want $state.from https://github.com/sveltejs/svelte/issues/12956
	let _codeInput = $state('');
	const codeInput = {
		get current() {
			return _codeInput;
		},
		set current(text: string) {
			_codeInput = text.toUpperCase();
		}
	};
</script>

<div class="mt-4 flex flex-col items-center gap-3 md:flex-row">
	<div class="flex w-full md:max-w-84 flex-col rounded-2xl bg-white p-6 shadow md:h-72">
		<h3 class="text-2xl font-semibold">สร้างก๊วนมาอยู่ด้วยกัน</h3>
		<p class="mt-2 h-12 leading-5">
			ใคร ๆ ก็อยากเป็นหัวแถว ส่งโค้ดนี้ให้เพื่อนเพื่อเชิญเพื่อนเข้าทีมเลย!
		</p>
		<div class="mt-4 flex flex-wrap items-center gap-4">
			<code class="text-5xl tracking-[0.2em]">594F</code>
			<Button variant="secondary">สร้างใหม่</Button>
		</div>
		<div class="min-h-8 flex-1"></div>
		<p class="mb-1">หรือถ้าน้องอินโทรเวิร์ด ไม่ต้องส่งให้ใครก็ได้นะ</p>
	</div>
	<span class="text-lg">หรือ</span>
	<div class="flex w-full md:max-w-84 flex-col rounded-2xl bg-white p-6 shadow md:h-72">
		<h3 class="text-2xl font-semibold">เข้าร่วมก๊วนกับเพื่อน</h3>
		<p class="mt-2 h-12 leading-5">ใส่โค้ดที่ได้จากเพื่อนเพื่อไปอยู่ด้วนกันเล้ย</p>
		<div class="mt-4">
			<InputOTP.Root
				maxlength={4}
				bind:value={codeInput.current}
				pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
			>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells as cell}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</div>
		<div class="min-h-8 flex-1"></div>
		<Button variant="secondary" >เข้าร่วม</Button>
	</div>
</div>

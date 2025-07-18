<script lang="ts">
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth/client';
	import BackButton from '$lib/components/back-button.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { departmentLabels, departmentIds } from '$lib/departments';
	import { trpcClient } from '$lib/trpc';
	import { registrationSchema } from '@freshmen68/dto';
	import { toast } from 'svelte-sonner';
	import { fromStore } from 'svelte/store';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import type { Snapshot } from './$types';
	import PrivacyPolicy from './privacy-policy.svelte';

	let { data } = $props();
	const { isRegistered } = $derived(data);

	let session = fromStore(authClient.useSession());
	let email = $derived(session.current.data?.user.email!);
	let studentId = $derived(email?.split('@')[0]);

	const form = superForm(data.form, {
		SPA: true,
		resetForm: false,
		validators: zod4(registrationSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				return;
			}
			// console.log('Form submitted:', form.data);
			try {
				if (isRegistered) {
					await trpcClient().user.updateStudentInfo.mutate({
						...form.data
					});
					toast.success('บันทึกข้อมูลสำเร็จ 🎉');
				} else {
					await trpcClient().user.register.mutate({
						...form.data
					});
					toast.success('ลงทะเบียนสำเร็จ 🎉');
				}
			} catch {
				toast.error('เกิดข้อผิดพลาดขึ้น');
				console.error('Error during registration:', error);
				return;
			}
			await goto('/menu');
		}
	});

	const { form: formData, enhance } = form;

	const titleOptions = [
		{ value: 'นาย', label: 'นาย' },
		{ value: 'นางสาว', label: 'นางสาว' },
		{ value: 'นาง', label: 'นาง' }
	];

	const departmentOptions = departmentIds.map((id) => ({
		value: id,
		label: departmentLabels[id]
	}));

	export const snapshot: Snapshot = {
		capture() {
			return $formData;
		},
		restore(snapshot) {
			$formData = snapshot;
		}
	};
</script>

<section class="mx-auto max-w-[60rem] px-5 py-14">
	<nav class="flex items-center justify-between gap-4">
		<BackButton href="/menu" />
		<h1 class="text-center text-3xl font-medium">ฟอร์มลงทะเบียน</h1>
		<div class="w-10"></div>
	</nav>

	<form method="POST" use:enhance class="mt-12">
		<!-- Personal Information -->
		<h2 class="mt-8 text-2xl font-semibold">ข้อมูลส่วนตัว</h2>
		<div class="mt-3 space-y-3 rounded-2xl bg-white p-5 pt-7 shadow-md">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<FormField {form} name="title">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>คำนำหน้า</FormLabel>
							<Select bind:value={$formData.title} type="single">
								<SelectTrigger {...props} class="w-full">
									{titleOptions.find((option) => option.value === $formData.title)?.label ??
										'เลือกคำนำหน้า'}
								</SelectTrigger>
								<SelectContent>
									{#each titleOptions as option}
										<SelectItem value={option.value}>{option.label}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="firstName">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>ชื่อ</FormLabel>
							<Input {...props} bind:value={$formData.firstName} placeholder="สมชาย" />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="lastName">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>นามสกุล</FormLabel>
							<Input {...props} bind:value={$formData.lastName} placeholder="ใจดี" />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField {form} name="nickname">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>ชื่อเล่น (ไม่บังคับ)</FormLabel>
							<Input {...props} bind:value={$formData.nickname} placeholder="ชาย" />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<div class="space-y-2">
					<Label for="student-id">รหัสนิสิต</Label>
					<Input id="student-id" value={studentId} disabled />
				</div>
			</div>

			<FormField {form} name="department">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>สาขาวิชา</FormLabel>
						<Select bind:value={$formData.department} type="single">
							<SelectTrigger {...props} class="w-full">
								{departmentOptions.find((option) => option.value === $formData.department)?.label ??
									'เลือกสาขาวิชา'}
							</SelectTrigger>
							<SelectContent>
								{#each departmentOptions as option}
									<SelectItem value={option.value}>{option.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</div>

		<!-- Contact Information -->
		<h2 class="mt-8 text-2xl font-semibold">ข้อมูลการติดต่อ</h2>
		<div class="mt-3 space-y-3 rounded-2xl bg-white p-5 pt-7 shadow-md">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="email">อีเมล</Label>
					<Input
						type="email"
						id="email"
						value={email}
						placeholder="somchai.j@somchai.com"
						disabled
					/>
				</div>

				<FormField {form} name="phone">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>หมายเลขโทรศัพท์</FormLabel>
							<Input {...props} type="tel" bind:value={$formData.phone} placeholder="0812345678" />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>
			</div>
		</div>

		<!-- Emergency Contact -->
		<h2 class="mt-8 text-2xl font-semibold">ผู้ติดต่อฉุกเฉิน</h2>
		<div class="mt-3 space-y-3 rounded-2xl bg-white p-5 pt-7 shadow-md">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<FormField {form} name="emergencyContactName">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>ชื่อผู้ติดต่อฉุกเฉิน</FormLabel>
							<Input
								{...props}
								bind:value={$formData.emergencyContactName}
								placeholder="นางสาวสมหญิง ใจดี"
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

				<FormField {form} name="emergencyContactPhone">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>หมายเลขโทรศัพท์ผู้ติดต่อฉุกเฉิน</FormLabel>
							<Input
								{...props}
								type="tel"
								bind:value={$formData.emergencyContactPhone}
								placeholder="0898765432"
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>
			</div>

			<FormField {form} name="emergencyContactRelationship">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>ความสัมพันธ์</FormLabel>
						<Input
							{...props}
							bind:value={$formData.emergencyContactRelationship}
							placeholder="แม่"
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</div>

		<!-- Medical Information -->
		<h2 class="mt-8 text-2xl font-semibold">ข้อมูลทางการแพทย์ (ไม่บังคับ)</h2>
		<div class="mt-3 space-y-3 rounded-2xl bg-white p-5 pt-7 shadow-md">
			<FormField {form} name="medicalConditions">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>โรคประจำตัว</FormLabel>
						<Textarea
							{...props}
							bind:value={$formData.medicalConditions}
							placeholder="โรคหืด, โรคความดันโลหิตสูง"
							rows={3}
						/>
					{/snippet}
				</FormControl>
				<FormDescription>กรุณาระบุโรคประจำตัวที่เราควรทราบ</FormDescription>
				<FormFieldErrors />
			</FormField>

			<FormField {form} name="drugAllergies">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>แพ้ยา</FormLabel>
						<Textarea
							{...props}
							bind:value={$formData.drugAllergies}
							placeholder="เพนิซิลลิน, แอสไพริน"
							rows={2}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<FormField {form} name="foodAllergies">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>แพ้อาหาร</FormLabel>
						<Textarea
							{...props}
							bind:value={$formData.foodAllergies}
							placeholder="กุ้ง, ปู, หอย"
							rows={2}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>

			<FormField {form} name="foodLimitations">
				<FormControl>
					{#snippet children({ props })}
						<FormLabel>ข้อจำกัดด้านอาหาร</FormLabel>
						<Textarea
							{...props}
							bind:value={$formData.foodLimitations}
							placeholder="เช่น มังสวิรัติ, เจ, ฮาลาล, โคเชอร์ เป็นต้น"
							rows={2}
						/>
					{/snippet}
				</FormControl>
				<FormFieldErrors />
			</FormField>
		</div>

		<!-- Privacy Policy -->
		<div class="mt-8 space-y-3 rounded-2xl bg-white p-5 pt-7 shadow-md">
			<PrivacyPolicy />
		</div>
		<div class="mt-8 text-center text-sm text-gray-500">
			ในการลงทะเบียนเข้าร่วมกิจกรรมของโครงการฯ ท่านยินยอมให้มีการเก็บรวบรวม ใช้
			และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายนี้
		</div>

		<!-- Submit Button -->
		<div class="flex justify-end pt-6">
			<Button type="submit" size="lg" class="text-md mt-4 h-12 w-full ">
				{#if isRegistered}
					บันทึก
				{:else}
					ลงทะเบียน
				{/if}
			</Button>
		</div>
	</form>
</section>

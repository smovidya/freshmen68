<script lang="ts">
	import { authClient } from '$lib/auth/client';
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
	import { trpcClient } from '$lib/trpc';
	import { registrationSchema } from '@freshmen68/dto';
	import { toast } from 'svelte-sonner';
	import { fromStore } from 'svelte/store';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	let session = fromStore(authClient.useSession())
	let email = $derived(session.current.data?.user.email!)
	let studentId = $derived(email?.split("@")[0])
	
	const form = superForm(defaults(zod4(registrationSchema)), {
		SPA: true,
		validators: zod4(registrationSchema),
		onUpdate: async ({ form }) => {
			if (!form.valid) {
				return;
			}
			console.log('Form submitted:', form.data);
			try {
				trpcClient.user.register.mutate({
					...form.data
				});
			} catch {
				toast.error('เกิดข้อผิดพลาดขึ้น');
			}
		}
	});

	const { form: formData, enhance } = form;

	const titleOptions = [
		{ value: 'นาย', label: 'นาย' },
		{ value: 'นางสาว', label: 'นางสาว' },
		{ value: 'นาง', label: 'นาง' }
	];

	// TODO: get department list
	const departmentOptions = [
		{ value: 'engineering', label: 'วิศวกรรมศาสตร์' },
		{ value: 'medicine', label: 'แพทยศาสตร์' },
		{ value: 'arts', label: 'อักษรศาสตร์' },
		{ value: 'science', label: 'วิทยาศาสตร์' },
		{ value: 'commerce', label: 'พาณิชยศาสตร์และการบัญชี' },
		{ value: 'political-science', label: 'รัฐศาสตร์' },
		{ value: 'economics', label: 'เศรษฐศาสตร์' },
		{ value: 'education', label: 'ครุศาสตร์' },
		{ value: 'communication-arts', label: 'นิเทศศาสตร์' },
		{ value: 'psychology', label: 'จิตวิทยา' },
		{ value: 'architecture', label: 'สถาปัตยกรรมศาสตร์' },
		{ value: 'dentistry', label: 'ทันตแพทยศาสตร์' },
		{ value: 'pharmaceutical-sciences', label: 'เภสัชศาสตร์' },
		{ value: 'law', label: 'นิติศาสตร์' },
		{ value: 'fine-arts', label: 'ศิลปกรรมศาสตร์' },
		{ value: 'nursing', label: 'พยาบาลศาสตร์' },
		{ value: 'allied-health', label: 'สหเวชศาสตร์' },
		{ value: 'veterinary', label: 'สัตวแพทยศาสตร์' },
		{ value: 'sports-science', label: 'วิทยาศาสตร์การกีฬา' }
	];
</script>

<section class="bg-primary flex flex-col items-center gap-3 p-6 pb-4">
	<div class="flex size-32 items-center justify-center rounded-full bg-white"></div>
	<div class="text-center">
		<h1 class="text-2xl font-medium">แบบฟอร์มลงทะเบียน</h1>
		<span class="text-muted-foreground">Registration</span>
	</div>
</section>

<section class="mx-auto max-w-4xl p-6">
	<form method="POST" use:enhance class="space-y-8">
		<!-- Personal Information -->
		<div class="space-y-6">
			<h2 class="border-b pb-2 text-xl font-semibold">ข้อมูลส่วนตัว</h2>

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
						<FormLabel>ภาควิชา</FormLabel>
						<Select bind:value={$formData.department} type="single">
							<SelectTrigger {...props} class="w-full">
								{departmentOptions.find((option) => option.value === $formData.department)?.label ??
									'เลือกภาควิชา'}
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
		<div class="space-y-6">
			<h2 class="border-b pb-2 text-xl font-semibold">ข้อมูลการติดต่อ</h2>

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
		<div class="space-y-6">
			<h2 class="border-b pb-2 text-xl font-semibold">ผู้ติดต่อฉุกเฉิน</h2>

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
		<div class="space-y-6">
			<h2 class="border-b pb-2 text-xl font-semibold">ข้อมูลทางการแพทย์ (ไม่บังคับ)</h2>

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

		<!-- Submit Button -->
		<div class="flex justify-end pt-6">
			<Button type="submit" size="lg" class="w-full">ลงทะเบียน</Button>
		</div>
	</form>
</section>

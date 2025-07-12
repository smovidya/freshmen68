<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		FormControl,
		FormDescription,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger
	} from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { registrationSchema } from '@freshmen68/dto';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	const form = superForm(defaults(zod4(registrationSchema)), {
		SPA: true,
		validators: zod4(registrationSchema),
		onSubmit: ({ formData }) => {
			console.log('Form submitted:', formData);
			// Handle form submission here
		}
	});

	const { form: formData, enhance } = form;

	const titleOptions = [
		{ value: 'mr', label: 'นาย' },
		{ value: 'ms', label: 'นางสาว' },
		{ value: 'mrs', label: 'นาง' }
	];

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

	const relationshipOptions = [
		{ value: 'parent', label: 'ผู้ปกครอง' },
		{ value: 'guardian', label: 'ผู้อุปการะ' },
		{ value: 'sibling', label: 'พี่น้อง' },
		{ value: 'relative', label: 'ญาติ' },
		{ value: 'friend', label: 'เพื่อน' },
		{ value: 'other', label: 'อื่นๆ' }
	];
</script>

<section class="bg-muted flex flex-col items-center gap-3 p-6 pb-4">
	<div class="flex size-48 items-center justify-center rounded-full bg-blue-500"></div>
	<div class="text-center">
		<h1 class="text-2xl font-medium">ลงทะเบียน</h1>
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

				<FormField {form} name="studentId">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>รหัสนิสิต</FormLabel>
							<Input {...props} bind:value={$formData.studentId} placeholder="6612345678" />
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>
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
				<FormField {form} name="email">
					<FormControl>
						{#snippet children({ props })}
							<FormLabel>อีเมล</FormLabel>
							<Input
								{...props}
								type="email"
								bind:value={$formData.email}
								placeholder="somchai.j@somchai.com"
							/>
						{/snippet}
					</FormControl>
					<FormFieldErrors />
				</FormField>

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
							placeholder="มังสวิรัติ, ไม่ทานเนื้อววั"
							rows={2}
						/>
					{/snippet}
				</FormControl>
				<FormDescription>เช่น มังสวิรัติ, เจ, ฮาลาล, โคเชอร์ เป็นต้น</FormDescription>
				<FormFieldErrors />
			</FormField>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-end pt-6">
			<Button type="submit" size="lg" class="w-full">ลงทะเบียน</Button>
		</div>
	</form>
</section>

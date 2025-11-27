<script setup lang="ts">
import { reactive, toRefs, watch } from "vue"
import { UserInterfaces } from "@/interfaces"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required, minLength } from "@vuelidate/validators"

// Component
import Button from "@/components/Base/Button"
import { FormLabel, FormInput } from "@/components/Base/Form"
import SkeletonForm from "./SkeletonForm.vue"

const props = defineProps<{
	user: UserInterfaces.User | null
	formLoading: boolean
	isLoading: boolean
	formReset: boolean
}>()

const emit = defineEmits(["submitForm"])

const formData = reactive({
	first_name: props.user?.first_name,
	last_name: props.user?.last_name,
})

const rules = {
	first_name: {
		required,
		minLength: minLength(4),
	},
	last_name: {
		required,
		minLength: minLength(4),
	},
}

const validate = useVuelidate(rules, toRefs(formData))

const onSubmitForm = () => {
	validate.value.$touch()
	if (validate.value.$invalid) {
		responseDefaultError("form_check")
	} else {
		emit("submitForm", { ...formData })
	}
}

const initForm = () => {
	formData.first_name = props.user?.first_name
	formData.last_name = props.user?.last_name
}

watch(
	() => props.user,
	() => {
		initForm()
	},
	{ deep: true }
)

watch(
	() => props.formReset,
	() => {
		initForm()
	}
)
</script>

<template>
	<!-- BEGIN: Validation Form -->
	<form class="validate-form" @submit.prevent="onSubmitForm">
		<template v-if="isLoading || !user">
			<SkeletonForm />
		</template>
		<template v-else>
			<div class="input-form">
				<FormLabel
					html-for="first-name"
					class="flex flex-col w-full sm:flex-row"
				>
					First Name
				</FormLabel>
				<FormInput
					id="first-name"
					v-model.trim="validate.first_name.$model"
					type="text"
					name="name"
					:class="{
						'border-danger': validate.first_name.$error,
					}"
					placeholder="John"
				/>
				<template v-if="validate.first_name.$error">
					<div
						v-for="(error, index) in validate.first_name.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						"<span class="uppercase">{{ error.$property }}</span
						>" {{ error.$message }}
					</div>
				</template>
			</div>

			<div class="mt-3 input-form">
				<FormLabel
					html-for="last-name"
					class="flex flex-col w-full sm:flex-row"
				>
					Last Name
				</FormLabel>
				<FormInput
					id="last-name"
					v-model.trim="validate.last_name.$model"
					type="text"
					name="name"
					:class="{
						'border-danger': validate.last_name.$error,
					}"
					placeholder="Legend"
				/>
				<template v-if="validate.last_name.$error">
					<div
						v-for="(error, index) in validate.last_name.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						"<span class="uppercase">{{ error.$property }}</span
						>" {{ error.$message }}
					</div>
				</template>
			</div>

			<div class="mt-3 input-form">
				<FormLabel html-for="email" class="flex flex-col w-full sm:flex-row">
					Email
				</FormLabel>
				<FormInput
					id="email"
					type="text"
					name="email"
					placeholder="example@gmail.com"
					disabled
					:value="user?.email"
				/>
			</div>

			<Button
				variant="primary"
				type="submit"
				class="mt-5"
				:disabled="formLoading"
			>
				Save
			</Button>
		</template>
	</form>
	<!-- END: Validation Form -->
</template>

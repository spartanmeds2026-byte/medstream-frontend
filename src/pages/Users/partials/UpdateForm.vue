<script setup lang="ts">
import { reactive, toRefs, watch } from "vue"
import { UserInterfaces } from "@/interfaces"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required, minLength, email } from "@vuelidate/validators"
import {
	containsLowercase,
	containsUppercase,
	containsNumber,
	containsSpecial,
} from "@/utils/_S9/formValidate"

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
	email: props.user?.email,
	password: "",
})

const rules = {
	first_name: {
		required,
		minLength: minLength(2),
	},
	email: {
		required,
		email,
	},
	password: {
		minLength: minLength(6),
		containsLowercase,
		containsUppercase,
		containsNumber,
		containsSpecial,
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
	formData.email = props.user?.email
	formData.password = ""
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
					Name
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
				<FormLabel html-for="email" class="flex flex-col w-full sm:flex-row">
					Email
				</FormLabel>
				<FormInput
					id="email"
					v-model.trim="validate.email.$model"
					type="email"
					name="email"
					:class="{ 'border-danger': validate.email.$error }"
					placeholder="example@gmail.com"
				/>
				<template v-if="validate.email.$error">
					<div
						v-for="(error, index) in validate.email.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						"<span class="uppercase">{{ error.$property }}</span
						>" {{ error.$message }}
					</div>
				</template>
			</div>

			<div class="mt-3 input-form">
				<FormLabel html-for="password" class="flex flex-col w-full sm:flex-row">
					Password
				</FormLabel>
				<FormInput
					id="password"
					v-model.trim="validate.password.$model"
					type="password"
					name="password"
					:class="{ 'border-danger': validate.password.$error }"
					placeholder="Password"
					autocomplete="off"
				/>
				<template v-if="validate.password.$error">
					<div
						v-for="(error, index) in validate.password.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						"<span class="uppercase">{{ error.$property }}</span
						>" {{ error.$message }}
					</div>
				</template>
			</div>

			<Button
				variant="primary"
				type="submit"
				class="mt-5"
				:disabled="formLoading"
			>
				Update
			</Button>
		</template>
	</form>
	<!-- END: Validation Form -->
</template>

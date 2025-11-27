<script setup lang="ts">
import { reactive, toRefs, watch } from "vue"
import { UserInterfaces } from "@/interfaces"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required, minLength } from "@vuelidate/validators"
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
	password: "",
	new_password: "",
	confirm_new_password: "",
})

const rules = {
	password: {
		required,
		minLength: minLength(6),
		containsLowercase,
		containsUppercase,
		containsNumber,
		containsSpecial,
	},
	new_password: {
		required,
		minLength: minLength(6),
		containsLowercase,
		containsUppercase,
		containsNumber,
		containsSpecial,
	},
	confirm_new_password: {
		required,
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
	formData.password = ""
	formData.new_password = ""
	formData.confirm_new_password = ""
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
				<FormLabel html-for="password" class="flex flex-col w-full sm:flex-row">
					Current Password
				</FormLabel>
				<FormInput
					id="password"
					v-model.trim="validate.password.$model"
					type="password"
					name="name"
					placeholder="Password"
					autocomplete="off"
					:class="{
						'border-danger': validate.password.$error,
					}"
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

			<div class="mt-3 input-form">
				<FormLabel
					html-for="new_password"
					class="flex flex-col w-full sm:flex-row"
				>
					New Password
				</FormLabel>
				<FormInput
					id="new_password"
					v-model.trim="validate.new_password.$model"
					type="password"
					name="name"
					placeholder="New Password"
					autocomplete="off"
					:class="{
						'border-danger': validate.new_password.$error,
					}"
				/>
				<template v-if="validate.new_password.$error">
					<div
						v-for="(error, index) in validate.new_password.$errors"
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
					html-for="confirm_new_password"
					class="flex flex-col w-full sm:flex-row"
				>
					Confirm New Password
				</FormLabel>
				<FormInput
					id="confirm_new_password"
					v-model.trim="validate.confirm_new_password.$model"
					type="password"
					placeholder="Confirm New Password"
					name="confirm_new_password"
					autocomplete="off"
					:class="{ 'border-danger': validate.confirm_new_password.$error }"
				/>
				<template v-if="validate.confirm_new_password.$error">
					<div
						v-for="(error, index) in validate.confirm_new_password.$errors"
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

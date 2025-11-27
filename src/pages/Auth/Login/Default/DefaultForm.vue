<script setup lang="ts">
import { ref, reactive, toRefs } from "vue"
import type { AxiosError } from "@/utils/axios"
import { ApiInterfaces } from "@/interfaces"
import {
	responseDefaultError,
	responseDefaultSuccess,
} from "@/utils/_S9/helper"
import { useVuelidate } from "@vuelidate/core"
import { required, minLength, email } from "@vuelidate/validators"
import { AuthStore } from "@/stores"

// Component
import { FormInput, FormCheck } from "@/components/Base/Form"
import Button from "@/components/Base/Button"

const authStore = AuthStore.useStore()

const formLoading = ref<boolean>(false)
const formData = reactive({
	email: "",
	password: "",
})

const rules = {
	email: {
		required,
		email,
	},
	password: {
		required,
		minLength: minLength(6),
	},
}

const validate = useVuelidate(rules, toRefs(formData))

const login = () => {
	validate.value.$touch()
	if (validate.value.$invalid) {
		responseDefaultError("form_check")
	} else {
		formLoading.value = true
		authStore
			.loginPassword(formData)
			.then(() => {
				responseDefaultSuccess("login")
			})
			.catch((error: AxiosError<ApiInterfaces.Response<string>>) =>
				responseDefaultError(error)
			)
			.finally(() => {
				formLoading.value = false
			})
	}
}
</script>

<template>
	<form class="intro-x space-y-4 mt-8" @submit.prevent="login">
		<div class="intro-x">
			<FormInput
				v-model="formData.email"
				type="email"
				class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
				placeholder="Email"
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
			<FormInput
				v-model="formData.password"
				type="password"
				class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
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
		<div
			class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
		>
			<div class="flex items-center mr-auto">
				<FormCheck.Input id="remember-me" type="checkbox" class="mr-2 border" />
				<label class="cursor-pointer select-none" htmlFor="remember-me">
					Remember me
				</label>
			</div>
			<a href="">Forgot Password?</a>
		</div>
		<div class="mt-5 intro-x xl:mt-8">
			<Button
				:disabled="formLoading"
				variant="primary"
				class="w-full px-4 py-3 text-base"
			>
				Login
			</Button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { AuthInterfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"
import { AuthStore } from "@/stores"
import type { CountryCode as CountryCodeType } from "maz-ui/components/MazPhoneNumberInput"

// Component
import MazPhoneNumberInput from "maz-ui/components/MazPhoneNumberInput"
import Button from "@/components/Base/Button"
import InputMask from "primevue/inputmask"
import { AuthApi } from "@/api"

const authStore = AuthStore.useStore()

const isToConfirmed = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const countryCode = ref<CountryCodeType>("US")
const numberStruct = ref<{
	countryCode?: string
	isValid?: boolean
	isPossible?: boolean
	countryCallingCode?: string
	nationalNumber?: string
	type?: string
	formatInternational?: string
	formatNational?: string
	uri?: string
	e164?: string
	rfc3966?: string
	phoneNumber?: string
}>({})

const FORM = ref<AuthInterfaces.StytchSMSVerify>({
	code: "",
	method_id: "",
})

const loginSendPhoneNumber = () => {
	formLoading.value = true
	if (numberStruct.value.isValid && numberStruct.value.e164)
		AuthApi.loginSMS({ phone: numberStruct.value.e164 })
			.then((response) => {
				FORM.value.method_id = response.phone_id
				isToConfirmed.value = true
			})
			.catch((error) => responseDefaultError(error))
			.finally(() => {
				formLoading.value = false
			})
}

const loginVerifyCode = () => {
	formLoading.value = true
	authStore
		.loginVerifyCodeSMS(FORM.value)
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}
</script>

<template>
	<template v-if="!isToConfirmed">
		<form class="intro-x space-y-4 mt-8" @submit.prevent="loginSendPhoneNumber">
			<div class="intro-x">
				<MazPhoneNumberInput
					v-model:country-code="countryCode"
					class="w-full login__input shadow-sm"
					show-code-on-list
					:only-countries="['US']"
					country-locale="en-US"
					@update="numberStruct = $event"
				/>
			</div>
			<div class="mt-5 intro-x xl:mt-8">
				<Button
					:disabled="formLoading || !numberStruct?.isValid"
					variant="primary"
					class="w-full px-4 py-3 text-base"
				>
					Send Code
				</Button>
			</div>
		</form>
	</template>
	<template v-else>
		<form class="intro-x space-y-4 mt-8" @submit.prevent="loginVerifyCode">
			<div class="intro-x">
				<InputMask
					v-model="FORM.code"
					mask="999-999"
					class="!text-xl !text-center block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px] w-full"
					placeholder="XXX-XXX"
				/>
			</div>
			<div class="mt-5 intro-x xl:mt-8">
				<Button
					:disabled="formLoading"
					variant="primary"
					class="w-full px-4 py-3 text-base"
				>
					Verify Code
				</Button>
			</div>
		</form>
	</template>
</template>

<style>
@import "maz-ui/styles";
:root {
	--maz-border-radius: 0.375rem !important;
}
</style>

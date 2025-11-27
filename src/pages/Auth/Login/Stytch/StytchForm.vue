<script setup lang="ts">
import { ref, onBeforeUnmount, onBeforeMount, watchEffect } from "vue"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import { AuthStore } from "@/stores"

// Component
import { FormInput } from "@/components/Base/Form"
import Button from "@/components/Base/Button"
import ConfirmationEmail from "./ConfirmationEmail.vue"
import { AuthApi } from "@/api"

const authStore = AuthStore.useStore()

const formLoading = ref<boolean>(false)
const FORM = ref({
	email: "",
})

const emit = defineEmits(["fullScreen"])

const loginStytch = () => {
	formLoading.value = true
	AuthApi.loginStytch({ email: FORM.value.email })
		.then(() => {
			setWaitingEmail()
			isToConfirmed.value = true
			emit("fullScreen")
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const isToConfirmed = ref<boolean>(false)
let intervalId: NodeJS.Timeout | undefined
const loginWindow = ref<{
	WaitingEmail: string | null
	WindowOpen: string | null
	WindowRedirect: boolean
}>({
	WaitingEmail: null,
	WindowOpen: null,
	WindowRedirect: false,
})

const setWaitingEmail = () => {
	window.onbeforeunload = () => localStorage.removeItem("waitingEmail")

	localStorage.setItem("waitingEmail", FORM.value.email)

	intervalId = setInterval(() => {
		loginWindow.value.WaitingEmail = localStorage.getItem("waitingEmail")
		loginWindow.value.WindowOpen = localStorage.getItem("windowLoginOpen")
		if (
			loginWindow.value.WindowOpen !== null &&
			JSON.parse(loginWindow.value.WindowOpen) == false
		) {
			localStorage.setItem("windowLoginOpen", JSON.stringify(true))
			loginWindow.value.WindowRedirect = true
		}
	}, 1000)
}

watchEffect(async () => {
	if (isToConfirmed.value && loginWindow.value.WindowRedirect) {
		clearInterval(intervalId)
		await authStore.authCheck()
		responseDefaultSuccess("login")

		setTimeout(() => {
			window.location.href = "/"
		}, 1000)
	}
})

onBeforeMount(() => {
	localStorage.removeItem("waitingEmail")
	localStorage.removeItem("windowLoginOpen")
})

onBeforeUnmount(() => {
	localStorage.removeItem("waitingEmail")
	localStorage.removeItem("windowLoginOpen")
	if (intervalId) clearInterval(intervalId)
})
</script>

<template>
	<template v-if="!isToConfirmed">
		<form class="intro-x space-y-4 mt-8" @submit.prevent="loginStytch">
			<div class="intro-x">
				<FormInput
					v-model="FORM.email"
					required
					type="email"
					class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
					placeholder="Email"
				/>
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
	<template v-else>
		<ConfirmationEmail :email="FORM.email" />
	</template>
</template>

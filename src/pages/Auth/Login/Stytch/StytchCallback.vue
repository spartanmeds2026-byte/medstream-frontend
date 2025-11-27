<script setup lang="ts">
import {
	onBeforeMount,
	ref,
	onBeforeUnmount,
	watchEffect,
	computed,
	watch,
} from "vue"
import { useRoute, useRouter } from "vue-router"
import { AuthStore } from "@/stores"
import { AuthInterfaces } from "@/interfaces"
import { responseDefaultSuccess } from "@/utils/_S9/helper"

// Component
import ThemeSwitcher from "@/components/ThemeSwitcher"
import Lucide from "@/components/Base/Lucide"
import BlankTemplateMessage from "@/components/_S9/BlankTemplateMessage.vue"
import LoadingIcon from "@/components/Base/LoadingIcon"

const route = useRoute()
const router = useRouter()
const authStore = AuthStore.useStore()

let intervalId: NodeJS.Timeout | undefined
const loginWindow = ref<{
	WaitingEmail: string | null
	WindowOpen: string | null
}>({
	WaitingEmail: null,
	WindowOpen: null,
})

const isFailedConfirmationEmail = ref(false)
const isAuthenticated = computed(() => authStore.getIsAuthenticated)
watch(isAuthenticated, (newValue) => {
	if (newValue) {
		setTimeout(() => {
			if (authStore.isAuthenticated) {
				responseDefaultSuccess("login")
				router.push({ name: "dashboard" })
			}
		}, 3000)
	}
})

onBeforeMount(() => {
	authStore.setAuthenticated(false)
	localStorage.setItem("windowLoginOpen", JSON.stringify(false))
	intervalId = setInterval(() => {
		loginWindow.value.WaitingEmail = localStorage.getItem("waitingEmail")
		loginWindow.value.WindowOpen = localStorage.getItem("windowLoginOpen")
	}, 1000)

	const params: AuthInterfaces.StytchCallBack = {
		stytch_token_type: route.query.stytch_token_type as string,
		token: route.query.token as string,
	}

	authStore.loginCallbackStytch(params).catch(() => {
		isFailedConfirmationEmail.value = true
		if (intervalId) clearInterval(intervalId)
	})
})

onBeforeUnmount(() => {
	localStorage.removeItem("waitingEmail")
	localStorage.removeItem("windowLoginOpen")
	if (intervalId) clearInterval(intervalId)
})

watchEffect(() => {
	if (
		loginWindow.value.WindowOpen !== null &&
		JSON.parse(loginWindow.value.WindowOpen)
	) {
		localStorage.removeItem("waitingEmail")
		localStorage.removeItem("windowLoginOpen")
		clearInterval(intervalId)
		window.close()
	}
})
</script>
<template>
	<ThemeSwitcher />
	<BlankTemplateMessage v-if="!isFailedConfirmationEmail">
		<template #icon>
			<Lucide icon="MailIcon" class="text-theme-1 h-12 w-12 mx-auto" />
		</template>
		<template #title>Verifying Account</template>
		<template #content>
			<LoadingIcon icon="grid" class="w-8 h-8 block mx-auto" />
		</template>
	</BlankTemplateMessage>
	<BlankTemplateMessage v-else>
		<template #icon>
			<Lucide icon="MailIcon" class="text-theme-1 h-12 w-12 mx-auto" />
		</template>
		<template #title> Failed to Confirm Account</template>
		<template #content>
			We couldn't verify your account.
			<br />
			Please try again or contact support for assistance.
		</template>
	</BlankTemplateMessage>
</template>

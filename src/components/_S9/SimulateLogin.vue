<script setup lang="ts">
import { ref } from "vue"
import { AuthStore } from "@/stores"
import { AuthApi } from "@/api"

// Components
import Lucide from "@/components/Base/Lucide"
import Button from "@/components/Base/Button"
import router from "@/router"

const authStore = AuthStore.useStore()
const formLoading = ref<boolean>(false)

const backToLogin = () => {
	formLoading.value = true
	AuthApi.exitSimulateLogin()
		.then(() => {
			location.href = router.resolve({
				name: "user",
				params: { userId: authStore.getUserId },
			}).fullPath
		})
		.finally(() => {
			formLoading.value = false
		})
}
</script>
<template>
	<div
		v-if="authStore.getIsSimulateLogin"
		class="mt-5 bg-dark px-4 py-2 rounded-lg text-center box intro-y"
	>
		<span class="font-medium text-white">
			<Lucide icon="User" class="w-6 h-6 mr-2 inline" />
			You are logged with {{ authStore.getUserName }}
			<Button
				variant="primary"
				:disabled="formLoading"
				size="sm"
				class="ml-2"
				@click="backToLogin()"
			>
				Back to Login
			</Button>
		</span>
	</div>
</template>

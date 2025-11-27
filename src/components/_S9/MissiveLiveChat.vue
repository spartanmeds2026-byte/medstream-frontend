<script setup>
import { onMounted } from "vue"
import { defaultMissiveLiveChat } from "@/defaultConfig"
import { AuthStore } from "@/stores"

const authStore = AuthStore.useStore()

onMounted(() => {
	if (authStore.getIsAuthenticated && defaultMissiveLiveChat) {
		window.MissiveChatConfig = {
			id: defaultMissiveLiveChat,
			user: {
				name: authStore.getUserName,
				email: authStore.getUserEmail,
				digest: authStore.getUser.digest,
			},
		}

		const script = document.createElement("script")
		script.async = true
		script.src = `https://webchat.missiveapp.com/${window.MissiveChatConfig.id}/missive.js`

		script.onload = () => {
			if (window.MissiveChat) {
				window.MissiveChat.hideButton()
			}
		}

		document.head.appendChild(script)
	}
})
</script>

<template>
	<div />
</template>

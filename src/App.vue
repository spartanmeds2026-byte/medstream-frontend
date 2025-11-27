<script setup lang="ts">
import { onMounted, computed } from "vue"
import { AuthStore } from "@/stores"
import { ThemeStore } from "@/stores"

// Components
import LiveChat from "@/components/_S9/LiveChat.vue"
import Marker_io from "@/components/_S9/Marker.io.vue"
import ConfirmDialog from "@/components/_S9/ConfirmDialog.vue"
import ToastNotification from "@/components/_S9/ToastNotification.vue"
import ConfirmDialogDelete from "@/components/_S9/ConfirmDialogDelete.vue"

const envCompany = import.meta.env.VITE_PROJECT_PORTAL
const authStore = AuthStore.useStore()
const themeStore = ThemeStore.useStore()
const defaultCompany = computed(() => themeStore.getCompanyDetail)

onMounted(() => {
	const domain = window.location.hostname.includes("medstream")
		? "medstream"
		: window.location.hostname.includes("spartan")
			? "spartan"
			: "spartan"

	const selectCompany = domain || envCompany

	themeStore.setCompany(selectCompany)

	if (authStore.getIsAuthenticated) authStore.authCheck()
})
</script>

<template>
	<title>
		{{ defaultCompany.title }}
	</title>

	<RouterView />
	<Marker_io />
	<LiveChat />
	<ToastNotification />
	<ConfirmDialog />
	<ConfirmDialogDelete />
</template>

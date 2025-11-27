<script setup lang="ts">
import { watch } from "vue"
import { ThemeStore } from "@/stores"

// Components
import RecentlyCustomers from "./partials/RecentlyProducts.vue"
import RecentlyOrders from "./partials/RecentlyOrders.vue"

const themeStore = ThemeStore.useStore()

watch(
	() => themeStore.getCompanyDetail,
	(newValue) => {
		if (!newValue?.title) return

		const breadcrumb = {
			router: "dashboard",
			titles: [newValue.title, "Dashboard"],
		}

		themeStore.setBreadcrumb(breadcrumb)
	},
	{ immediate: true, deep: true }
)
</script>

<template>
	<div class="grid grid-cols-12 gap-6 mt-10">
		<div class="col-span-12">
			<RecentlyOrders />
		</div>
		<div class="col-span-12 mt-6">
			<RecentlyCustomers />
		</div>
	</div>
</template>

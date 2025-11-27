<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue"
import { AuthStore } from "@/stores"
import { useThemeStore, getTheme } from "@/stores/theme"

// Component
import ThemeSwitcher from "@/components/ThemeSwitcher"
import Skeleton from "primevue/skeleton"
import LoadingIcon from "@/components/Base/LoadingIcon"

const themeStore = useThemeStore()
const Component = computed(() => getTheme(themeStore.theme).component)

const authStore = AuthStore.useStore()
const isLoading = ref<boolean>(true)

onBeforeMount(() => {
	authStore.authCheck().then((response) => {
		if (response) isLoading.value = false
	})
})
</script>

<template>
	<template v-if="isLoading">
		<Skeleton height="100vh" class="rounded-none" />
		<LoadingIcon
			icon="grid"
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 block mx-auto [&_svg]:fill-primary"
		/>
	</template>
	<template v-else>
		<div>
			<ThemeSwitcher />
			<component :is="Component" />
		</div>
	</template>
</template>

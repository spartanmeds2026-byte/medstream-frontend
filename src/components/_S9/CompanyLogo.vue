<script setup lang="ts">
import { ThemeStore } from "@/stores"
import { computed } from "vue"

interface Props {
	onlyOne?: boolean
	class?: string
	logoClass?: string
}

const props = withDefaults(defineProps<Props>(), {
	onlyOne: false,
	class: "",
	logoClass: "",
})

const defaultCompany = computed(() => ThemeStore.useStore().getCompanyDetail)
</script>

<template>
	<div :class="['flex items-center gap-2', props.class]">
		<template v-if="props.onlyOne">
			<component
				:is="defaultCompany.img[0]"
				:alt="defaultCompany.alt"
				:class="['w-full mx-auto max-h-20', props.logoClass]"
			/>
		</template>
		<template v-else>
			<component
				:is="logo"
				v-for="(logo, index) in defaultCompany.img"
				:key="index"
				:alt="defaultCompany.alt"
				:class="[
					'w-full mx-auto',
					logo.length == 1 && 'max-h-20',
					logo.length == 2 && 'max-h-24',
					props.logoClass,
				]"
			/>
		</template>
	</div>
</template>

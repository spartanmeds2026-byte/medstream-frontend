<script setup lang="ts">
import Img from "@/components/_S9/Img.vue"
import { UserInterfaces } from "@/interfaces"
import { computed } from "vue"

const props = withDefaults(
	defineProps<{
		user: UserInterfaces.User
		classImage?: string
		classText?: string
		showPicture?: boolean
		showName?: boolean
	}>(),
	{
		classImage: "",
		classText: "",
		showPicture: true,
		showName: true,
	}
)

const classImage = computed(() => {
	return (
		props.classImage || "block w-8 h-8 overflow-hidden rounded-full image-fit "
	)
})

const classText = computed(() => {
	return props.classText || "font-medium truncate"
})
</script>
<template>
	<div class="flex items-center gap-2">
		<div :class="classImage">
			<Img
				v-if="showPicture"
				:src="user.picture || null"
				:alt="`${user.first_name} ${user.last_name}`"
			/>
		</div>
		<span v-if="showName" :class="classText"
			>{{ user.first_name }} {{ user.last_name }}</span
		>
	</div>
</template>

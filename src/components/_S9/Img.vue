<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { avatarPreview } from "@/utils/_S9/helper"

// Component
import Skeleton from "primevue/skeleton"
import ImageZoom from "@/components/Base/ImageZoom"
import NoImage from "@/assets/images/placeholders/no_image.png"

const props = defineProps<{
	src: string | null | undefined
	class?: string
	zoom?: boolean
}>()

const emit = defineEmits<{
	(e: "error"): void
}>()

const isLoaded = ref(false)
const imageUrl = ref<string>("")

const getSrc = computed(() => {
	return avatarPreview(props.src || "") || NoImage
})

onMounted(() => {
	if (props.src) {
		const img = new Image()
		img.src = getSrc.value
		img.onload = () => {
			isLoaded.value = true
			imageUrl.value = getSrc.value
		}
		img.onerror = () => {
			isLoaded.value = true
			imageUrl.value = NoImage
			emit("error")
		}
	} else {
		isLoaded.value = true
		imageUrl.value = NoImage
		emit("error")
	}
})
</script>

<template>
	<Skeleton v-if="!isLoaded" :class="props.class" />
	<template v-else>
		<ImageZoom v-bind="props" :src="imageUrl" />
	</template>
</template>

<script setup lang="ts">
import { avatarPreview } from "@/utils/_S9/helper"
import { ref, computed, watch } from "vue"
import Lucide from "@/components/Base/Lucide"
import Skeleton from "primevue/skeleton"

const props = defineProps<{
	picture: string | null
	name: string
	formLoading: boolean
	isLoading: boolean
	formReset: boolean
}>()

const emit = defineEmits(["submitForm", "resetForm"])

const onLoadPreview = ref<string | null>(null)
const photoInput = ref<HTMLInputElement | null>(null)

const selectNewPhoto = () => {
	if (!photoInput.value) return
	photoInput.value.click()
}

const updatePhotoPreview = () => {
	const photo = photoInput.value?.files?.[0]

	if (!photo) return

	const reader = new FileReader()

	reader.onload = (e) => {
		if (e.target?.result) {
			onLoadPreview.value = e.target.result as string
			emit("submitForm", onLoadPreview.value)
		}
	}

	reader.readAsDataURL(photo)
}

const photoPreview = computed(() => {
	if (onLoadPreview.value) return onLoadPreview.value
	return avatarPreview(props.picture || props.name)
})

watch(
	() => props.formReset,
	() => {
		onLoadPreview.value = null
	}
)
</script>
<template>
	<div
		class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit"
	>
		<template v-if="isLoading">
			<Skeleton height="100%" shape="circle" />
		</template>
		<template v-else>
			<img class="rounded-full" :src="photoPreview" :alt="name" />
			<div
				class="cursor-pointer absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary"
				@click="selectNewPhoto"
			>
				<input
					id="photo"
					ref="photoInput"
					type="file"
					accept=".png, .jpg, .jpeg"
					class="hidden"
					:disabled="formLoading"
					@change="updatePhotoPreview"
				/>
				<Lucide icon="Camera" class="w-4 h-4 text-white" />
			</div>
		</template>
	</div>
</template>

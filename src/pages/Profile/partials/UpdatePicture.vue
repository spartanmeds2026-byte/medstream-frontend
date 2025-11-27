<script setup lang="ts">
import { avatarPreview } from "@/utils/_S9/helper"
import { ref, computed, watch } from "vue"

// Component
import Skeleton from "primevue/skeleton"
import Button from "@/components/Base/Button"

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
		class="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400"
	>
		<template v-if="isLoading">
			<Skeleton height="100%" />
		</template>
		<template v-else>
			<div class="relative h-48 mx-auto cursor-pointer image-fit zoom-in">
				<img class="rounded-md" :src="photoPreview" :alt="name" />
			</div>
			<div class="relative mx-auto mt-5">
				<Button
					:disabled="formLoading"
					variant="primary"
					type="button"
					class="w-full"
					@click="selectNewPhoto"
				>
					Change Photo
				</Button>
				<input
					id="photo"
					ref="photoInput"
					type="file"
					accept=".png, .jpg, .jpeg"
					:disabled="formLoading"
					class="hidden"
					@change="updatePhotoPreview"
				/>
			</div>
		</template>
	</div>
</template>

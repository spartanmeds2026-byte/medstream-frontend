<script setup lang="ts">
import {
	onBeforeUnmount,
	onMounted,
	ref,
	watchEffect,
	computed,
	onUpdated,
	Ref,
} from "vue"

// Components
import FormioCreateForm from "@/components/_S9/FormioCreateForm.vue"
import DeferredContent from "primevue/deferredcontent"
import Skeleton from "primevue/skeleton"
import "bootstrap/dist/js/bootstrap.min.js"
import { watch } from "vue"

const formio = ref<Ref<HTMLElement>>()

const emit = defineEmits(["submit", "submitDone", "change", "render", "modal"])

const props = withDefaults(
	defineProps<{
		src?: string
		url?: string
		form?: Record<string, any>
		options?: Record<string, any>
		submission?: Record<string, any>
		viewRender?: boolean
		skeleton?: boolean
		isLoading?: boolean
		formLoading?: boolean
		extSubmit?: boolean
		fullWidth?: boolean
	}>(),
	{
		src: "",
		url: "",
		form: undefined,
		displayAs: "form",
		options: undefined,
		submission: undefined,
		viewRender: false,
		skeleton: undefined,
		isLoading: undefined,
		formLoading: undefined,
	}
)

defineExpose({ formio })

const formKey = ref<symbol>(Symbol())
const formSubmission = ref<Record<string, any>>()
const stateFlags = ref(true)

watchEffect(async () => {
	if (props.submission) {
		formSubmission.value = props.submission
	}

	if (typeof props.isLoading !== "undefined") {
		stateFlags.value = props.isLoading
	}
})

const options = computed(() => {
	const opts = { ...(props.options || {}) }
	if (props.viewRender) {
		opts.readOnly = true
	}
	return opts
})

watch(
	() => options.value,
	() => {
		formKey.value = Symbol()
	},
	{ deep: true }
)

let intervalId: NodeJS.Timeout | undefined
onMounted(() => {
	intervalId = setInterval(() => {
		if (window.CKEDITOR_VERSION) {
			delete (window as any).CKEDITOR_VERSION
			clearInterval(intervalId)
		}
	}, 1000)
})

onBeforeUnmount(async () => {
	delete (window as any).CKEDITOR_VERSION
	delete (window as any).Formio
	if (intervalId) clearInterval(intervalId)
})

onUpdated(() => {
	console.log("Formio onUpdated")
	formKey.value = Symbol()
})

const onLoadComponent = () => {
	if (props.skeleton === undefined && props.isLoading === undefined)
		return (stateFlags.value = false)
	if (props.skeleton && props.isLoading === undefined) {
		setTimeout(() => {
			stateFlags.value = false
		}, 1500)
	}
}

watch(
	() => props.isLoading,
	(newValue) => {
		if (typeof newValue === "undefined") return
		stateFlags.value = newValue
	}
)

const handleSubmit = (submission: any) => {
	emit("submit", submission)
}

const handleSubmitDone = (submission: any) => {
	emit("submitDone", submission)
}

const handleChange = (event: any) => {
	emit("change", event)
}

const handleRender = (submission: any) => {
	emit("render", submission)
}

const handleModal = (event: any) => {
	if (event.type === "modal") emit("modal", event)
}
</script>

<template>
	<DeferredContent @load="onLoadComponent">
		<Skeleton v-if="stateFlags" height="24rem" />
		<div v-else :class="{ 'box p-4': !props.fullWidth }">
			<div
				v-show="formLoading"
				class="z-10 absolute bg-surface-100/50 dark:bg-surface-700/50 top-0 right-0 left-0 bottom-0 select-none"
			/>

			<FormioCreateForm
				ref="formio"
				v-bind="props"
				:submission="formSubmission"
				:options="options"
				@change="handleChange"
				@submit="handleSubmit"
				@submit-done="handleSubmitDone"
				@render="handleRender"
				@modal="handleModal"
			/>
		</div>
	</DeferredContent>
</template>

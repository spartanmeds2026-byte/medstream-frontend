<script setup lang="ts">
import {
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
	watchEffect,
	computed,
	Ref,
} from "vue"
import { persistFormio } from "@/utils/cache"

// Components
import FormioCreateBuilder from "@/components/_S9/FormioCreateBuilder.vue"
import DeferredContent from "primevue/deferredcontent"
import Skeleton from "primevue/skeleton"
import "bootstrap/dist/js/bootstrap.min.js"

type DisplayAs = "form" | "wizard" | "pdf"

const formio = ref<Ref<HTMLElement>>()

const emit = defineEmits(["change", "render", "updateDisplayAs", "submit:json"])

const props = withDefaults(
	defineProps<{
		form?: Record<string, any>
		displayAs?: DisplayAs
		options?: Record<string, any>
		persist?: boolean
		skeleton?: boolean
		extSubmit?: boolean
	}>(),
	{
		form: undefined,
		displayAs: "form",
		options: undefined,
		persist: false,
		skeleton: false,
	}
)

defineExpose({ formio })

const keyPersistFormio = ref<string>("FormioBuilder_" + location.pathname)

const formKey = ref<symbol>(Symbol())
const formStruct = ref<Record<string, any>>()
const stateFlags = ref(false)

watchEffect(async () => {
	if (props.form !== undefined) {
		formStruct.value = props.form
	} else {
		const persistedForm = await persistFormio.getItem(keyPersistFormio.value)
		if (persistedForm) formStruct.value = persistedForm
	}

	if (formStruct.value && formStruct.value.display)
		emit("updateDisplayAs", formStruct.value.display)

	formKey.value = Symbol()
})

const options = computed(() => {
	const opts = { ...(props.options || {}) }
	return opts
})

watch(
	() => props.displayAs,
	() => {
		if (formStruct.value) formStruct.value.display = props.displayAs
	}
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

const onLoadComponent = () => {
	if (!props.skeleton) return (stateFlags.value = false)

	setTimeout(() => {
		stateFlags.value = false
	}, 500)
}

const handleChange = (event: any) => {
	emit("change", event)
}

const handleRender = (submission: any) => {
	emit("render", submission)
}

const handleExportJson = (json: any) => {
	emit("submit:json", json)
}
</script>

<template>
	<DeferredContent @load="onLoadComponent">
		<Skeleton v-if="stateFlags" height="24rem" />
		<div v-else class="box p-4">
			<FormioCreateBuilder
				ref="formio"
				:key="formKey"
				v-bind="props"
				:form="formStruct"
				:options="options"
				@change="handleChange"
				@render="handleRender"
				@submit:json="handleExportJson"
			/>
		</div>
	</DeferredContent>
</template>

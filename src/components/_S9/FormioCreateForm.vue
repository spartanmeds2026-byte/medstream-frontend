<script lang="ts" setup>
import { Formio } from "formiojs"
import Premium from "@formio/premium/lib"
import { onMounted, onUnmounted, Ref, ref, watch } from "vue"
import { responseDefaultError } from "@/utils/_S9/helper"

// Components
import Skeleton from "primevue/skeleton"

Formio.use(Premium)

const html = ref<Ref<HTMLElement>>()
const instance = ref<any>(null)

const emit = defineEmits<{
	(e: string, ...args: any[]): void
}>()

const props = withDefaults(
	defineProps<{
		src?: string
		url?: string
		form?: Record<string, any>
		submission?: Record<string, any>
		language?: string
		options?: Record<string, any>
		extSubmit?: boolean
	}>(),
	{
		src: "",
		url: "",
		form: undefined,
		submission: undefined,
		language: "en",
		options: undefined,
		extSubmit: false,
	}
)

defineExpose({ instance, html })

const isLoading = ref(true)

watch(
	() => props.extSubmit,
	() => {
		instance.value.submit()
	}
)

const setupForm = (resolve: (value: any) => void) =>
	Formio.createForm(
		html.value,
		props.src || props.form || "",
		props.options
	).then((formio: any): any => {
		instance.value = formio

		if (props.submission) {
			formio.submission = props.submission
		}

		if (props.url) {
			formio.url = props.url
		}

		formio.language = props.language || "en"

		// Events
		formio.events.onAny((...args: any[]) => {
			const eventParts = args[0].split(".")

			const namespace: string = "formio"
			if (eventParts[0] !== namespace || eventParts.length !== 2) return

			args[0] = eventParts[1]
			emit(args[0], ...args.slice(1))

			if (eventParts[1] === "customEvent") {
				args[0] = args[1].type
				emit(args[0], ...args.slice(1))
			}
		})

		resolve(formio)
	})

const initializeForm = () =>
	new Promise((resolve, reject) => {
		if (props.src || props.form) {
			setupForm(resolve)
		} else {
			reject("Must set src or form attribute")
		}
	})

onMounted(() => {
	initializeForm()
		.then(() => {
			console.info("Init Form " + location.pathname)
			isLoading.value = false
		})
		.catch((error) => {
			console.error(error)
			if (error.message.includes("Formio")) {
				window.location.reload()
			} else {
				responseDefaultError(error)
			}
		})
})

onUnmounted(async () => {
	if (instance.value && typeof instance.value.destroy === "function") {
		console.info("Destroy Form " + location.pathname)
		await instance.value.destroy()
	}
})
</script>

<template>
	<div class="s9-formio-component relative overflow-hidden">
		<div v-show="isLoading">
			<Skeleton height="24rem" />
		</div>
		<div v-show="!isLoading">
			<div ref="html" />
		</div>
	</div>
</template>

<style lang="scss">
@import "@/assets/css/vendors/ckeditor.css";
@import "@/assets/css/_S9/bootstrap.scss";
@import "@/assets/css/_S9/formiojs.scss";

.s9-formio-component,
div:has(> .formio-dialog) {
	all: unset;
	@include bootstrap-theme;
	@include formio-theme;
}
</style>

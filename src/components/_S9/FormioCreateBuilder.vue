<!-- eslint-disable vue/require-explicit-emits -->
<script lang="ts" setup>
import { Formio } from "formiojs"
import Premium from "@formio/premium/lib"
import { onMounted, onUnmounted, Ref, ref, watch } from "vue"
import { persistFormio } from "@/utils/cache"
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
		form?: Record<string, any>
		options?: Record<string, any>
		persist?: boolean
		extSubmit?: boolean
	}>(),
	{
		form: undefined,
		options: undefined,
		extSubmit: false,
	}
)

defineExpose({ instance, html })

const keyPersistFormio = ref<string>("FormioBuilder_" + location.pathname)
const isLoading = ref(true)

watch(
	() => props.extSubmit,
	() => {
		emit("submit:json", instance.value.form)
	}
)

const setupForm = (resolve: (value: any) => void) =>
	Formio.builder(html.value, props.form, props.options).then(
		(formio: any): any => {
			instance.value = formio

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

				// Save to localStorage
				if (args[0] === "change" && props.persist)
					persistFormio.setItem(
						keyPersistFormio.value,
						JSON.parse(JSON.stringify(formio.form))
					)
			})

			resolve(formio)
		}
	)

const initializeForm = () => new Promise((resolve) => setupForm(resolve))

onMounted(() => {
	initializeForm()
		.then(() => {
			console.info("Init Form Builder " + location.pathname)
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
		console.info("Destroy Form Builder " + location.pathname)
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

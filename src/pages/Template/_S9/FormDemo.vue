<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"
import { FormioApi } from "@/api"
import { FormioInterfaces } from "@/interfaces"

const FormUrl = "https://examples.form.io/example"

const readonly = ref(false)

const isLoading = ref<boolean>(true)
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)

const onSubmitForm = (submission: any) => {
	console.log("Form submitted")
	console.log("data", submission)
}

const onExternalSubmit = ref(false)

onBeforeMount(() => {
	isLoading.value = true
	FormioApi.getFormJson(FormUrl)
		.then((response) => {
			formJson.value = response
		})
		.finally(() => {
			isLoading.value = false
		})
})
</script>

<template>
	<div
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Form Demo</h2>
		<template v-if="readonly">
			<Button
				class="min-w-20"
				variant="primary"
				@click="() => (readonly = !readonly)"
			>
				Edit
			</Button>
		</template>
		<template v-else>
			<Button
				class="min-w-20"
				variant="primary"
				@click="() => (onExternalSubmit = !onExternalSubmit)"
			>
				Save
			</Button>
		</template>
	</div>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="intro-y col-span-12">
			<Formio
				persist
				:view-render="readonly"
				:form="formJson"
				:is-loading="isLoading"
				:ext-submit="onExternalSubmit"
				@submit="onSubmitForm"
			/>
		</div>
	</div>
</template>

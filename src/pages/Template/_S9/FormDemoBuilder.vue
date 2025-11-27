<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { FormioApi } from "@/api"
import { FormioInterfaces } from "@/interfaces"

// Components
import FormioBuilder from "@/components/_S9/FormioBuilder.vue"
import Button from "@/components/Base/Button"
import Preview from "@/components/Base/Preview"
import { FormSelect } from "@/components/Base/Form"
import { Dialog } from "@/components/Base/Headless"

type DisplayAs = "form" | "wizard" | "pdf"

const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
onBeforeMount(() => {
	FormioApi.getFormJson("https://examples.form.io/example").then((data) => {
		formJson.value = data
		selectDisplay.value = data.display
			? (data.display as DisplayAs)
			: displayAs[0]
	})
})

const displayAs: DisplayAs[] = ["form", "wizard", "pdf"]
const selectDisplay = ref(displayAs[0])
const updateDisplayAs = (value: DisplayAs) => {
	selectDisplay.value = value
}

const onSubmitForm = (submission: any) => {
	console.log("Form submitted")
	console.log("data", submission)
}

const schemaForm = ref({})
const onExternalSubmit = ref(false)

const modalExportJson = ref(false)
const onExportJson = (json: object) => {
	schemaForm.value = json
	modalExportJson.value = true
}
</script>

<template>
	<h2
		class="mt-10 text-lg font-medium intro-y !z-50 flex justify-between items-center"
	>
		Form Demo

		<div class="relative text-base flex items-center flex-wrap gap-2">
			Display as
			<div class="inline-block w-28 box">
				<FormSelect v-model="selectDisplay" class="capitalize">
					<option v-for="item in displayAs" :key="item" :value="item">
						{{ item }}
					</option>
				</FormSelect>
			</div>
			<Button
				class="py-1 min-w-20 inline-block"
				variant="primary"
				@click="() => (onExternalSubmit = !onExternalSubmit)"
			>
				Export Form
			</Button>
		</div>
	</h2>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="intro-y col-span-12">
			<FormioBuilder
				persist
				:form="formJson"
				:display-as="selectDisplay"
				:ext-submit="onExternalSubmit"
				@update-display-as="updateDisplayAs"
				@submit="onSubmitForm"
				@submit:json="onExportJson"
			/>
		</div>
	</div>
	<!-- BEGIN: Modal Content -->
	<Dialog
		size="xl"
		:open="modalExportJson"
		@close="() => (modalExportJson = false)"
	>
		<Dialog.Panel class="p-10 max-h-[85dvh] overflow-auto">
			<Preview.Highlight
				type="json"
				variant="primary"
				class="sticky -top-6 z-50"
			>
				{{ schemaForm }}
			</Preview.Highlight>
		</Dialog.Panel>
	</Dialog>
	<!-- END: Modal Content -->
</template>

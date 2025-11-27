<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { FormioApi, CreditAppApi } from "@/api"
import { FormioInterfaces, CreditAppInterfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"

const router = useRouter()
const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgcoreappv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)

const onSubmitForm = (submission: CreditAppInterfaces.CreditApp) => {
	formLoading.value = true
	CreditAppApi.createCreditApp(submission)
		.then(() => {
			responseDefaultSuccess("created")
			router.push({ name: "credit-apps" })
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const onExternalSubmit = ref(false)

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([FormioApi.getFormJson(formUrl)])

		formJson.value = ApiJson
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoading.value = false
	}
})
</script>

<template>
	<div
		:class="[
			'flex p-3 sm:px-8 relative min-h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
			'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
			'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
		]"
	>
		<div class="container relative z-10 sm:px-10">
			<div
				class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
			>
				<h2 class="mr-auto text-3xl font-medium text-white">Credit App</h2>
				<Button
					class="min-w-20"
					variant="primary"
					@click="() => (onExternalSubmit = !onExternalSubmit)"
				>
					Save
				</Button>
			</div>
			<div class="grid grid-cols-12 gap-6 mt-5">
				<div class="col-span-12">
					<Formio
						ref="formInstance"
						persist
						:form="formJson"
						:url="formUrl"
						:form-loading="formLoading"
						:is-loading="isLoading"
						:ext-submit="onExternalSubmit"
						@submit="onSubmitForm"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

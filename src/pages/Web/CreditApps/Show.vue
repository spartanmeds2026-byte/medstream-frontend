<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FormioApi, CreditAppApi } from "@/api"
import { FormioInterfaces, CreditAppInterfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsCreditApp = routerPermissions({
	permissionRoute: "credit_apps",
	permissionName: "read",
})

const route = useRoute()
const router = useRouter()
const creditAppId = Number.parseInt(route.params.creditAppId as string, 10)

const isLoading = ref<boolean>(true)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgcoreappv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formSubmission = ref<CreditAppInterfaces.CreditApp | null>(null)

const getCreditApp = () => {
	return CreditAppApi.getCreditAppById(creditAppId).then((response) => {
		formSubmission.value = response
	})
}

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
			getCreditApp(),
		])

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
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Show Credit App</h2>
		<Button
			v-if="permissionsCreditApp.update"
			class="min-w-20"
			variant="primary"
			@click="
				() => router.push({ name: 'credit-app-edit', params: { creditAppId } })
			"
		>
			Edit
		</Button>
	</div>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="col-span-12">
			<Formio
				ref="formInstance"
				:form="formJson"
				:url="formUrl"
				:submission="{ data: formSubmission?.data }"
				view-render
				:is-loading="isLoading"
			/>
		</div>
	</div>
</template>

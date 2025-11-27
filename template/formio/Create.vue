<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRouter } from "vue-router"
import { FormioApi, ${rename_pascalCase}Api } from "@/api"
import { FormioInterfaces, ${rename_pascalCase}Interfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissions${rename_pascalCase} = routerPermissions({
	permissionRoute: "${rename_snakeCase}s",
	permissionName: "create",
})

const router = useRouter()
const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formInstance = ref<any>(null)
const formUrl = "${rename_formioUrl}"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)

const onSubmitForm = (submission: ${rename_pascalCase}Interfaces.${rename_pascalCase}) => {
	if (!permissions${rename_pascalCase}.create) return
	formLoading.value = true
	${rename_pascalCase}Api.create${rename_pascalCase}(submission)
		.then(() => {
			responseDefaultSuccess("created")
			router.push({ name: "${rename_kebabCase}s" })
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
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
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
		<h2 class="mr-auto text-lg font-medium">Create ${rename_startCase}</h2>
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
</template>

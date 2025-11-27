<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FormioApi, ${rename_pascalCase}Api } from "@/api"
import { FormioInterfaces, ${rename_pascalCase}Interfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissions${rename_pascalCase} = routerPermissions({
	permissionRoute: "${rename_snakeCase}s",
	permissionName: "read",
})

const route = useRoute()
const router = useRouter()
const ${rename_camelCase}Id = Number.parseInt(route.params.${rename_camelCase}Id as string, 10)

const isLoading = ref<boolean>(true)
const formInstance = ref<any>(null)
const formUrl = "${rename_formioUrl}"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formSubmission = ref<${rename_pascalCase}Interfaces.${rename_pascalCase} | null>(null)

const get${rename_pascalCase} = () => {
	return ${rename_pascalCase}Api.get${rename_pascalCase}ById(${rename_camelCase}Id).then((response) => {
		formSubmission.value = response
	})
}

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
			get${rename_pascalCase}(),
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
		<h2 class="mr-auto text-lg font-medium">Show ${rename_startCase}</h2>
		<Button
			v-if="permissions${rename_pascalCase}.update"
			class="min-w-20"
			variant="primary"
			@click="
				() => router.push({ name: '${rename_kebabCase}-edit', params: { ${rename_camelCase}Id } })
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

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { ${rename_pascalCase}Api } from "@/api"
import { ApiInterfaces, ${rename_pascalCase}Interfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import { rowsPerPageOptions } from "@/utils/_S9/helperDataTable"

// Component
import Button from "@/components/Base/Button"
import TableList from "./partials/TableList.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissions${rename_pascalCase} = routerPermissions({
	permissionRoute: "${rename_snakeCase}s",
	permissionName: "list"
})

const router = useRouter()
const isLoading = ref<boolean>(false)
const formLoading = ref<boolean>(false)

const records = ref<${rename_pascalCase}Interfaces.${rename_pascalCase}[]>([])
const pagination = ref<ApiInterfaces.Meta>({
	page: 1,
	limit: rowsPerPageOptions[0],
	total: rowsPerPageOptions[0],
	sortField: "id",
	sortOrder: -1,
})

const getRecords = async () => {
	try {
		formLoading.value = true

		const requests = [
			permissions${rename_pascalCase}.list
				? ${rename_pascalCase}Api.get${rename_pascalCase}s(pagination.value)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			pagination.value = {}
			records.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<${rename_pascalCase}Interfaces.${rename_pascalCase}>
			pagination.value = { ...pagination.value, ...response.meta }
			records.value = response.results
		}
	} catch (error) {
		responseDefaultError("error")
	} finally {
		formLoading.value = false
	}
}

const onChangePage = (params: ApiInterfaces.Meta) => {
	pagination.value = { ...pagination.value, ...params }
	if (!pagination.value.page) pagination.value.page = 1
	if (!pagination.value.limit || pagination.value.limit < rowsPerPageOptions[0])
		pagination.value.limit = rowsPerPageOptions[0]
	getRecords()
}

const onDeleteForm = (${rename_camelCase}Id: number) => {
	if (!permissions${rename_pascalCase}.del) return
	formLoading.value = true
	${rename_pascalCase}Api.delete${rename_pascalCase}(${rename_camelCase}Id)
		.then(() => {
			getRecords()
			responseDefaultSuccess("deleted")
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}
</script>

<template>
	<div>
		<div
			class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap"
		>
			<h2 class="text-lg font-medium">${rename_startCase}s</h2>
			<div class="ml-auto" />
			<Button
				v-if="permissions${rename_pascalCase}.create"
				variant="primary"
				class="shadow-md"
				@click="() => router.push({ name: '${rename_kebabCase}-create' })"
			>
				Add New ${rename_startCase}
			</Button>
		</div>
		<div class="grid grid-cols-12 gap-6 mt-5">
			<TableList
				:permissions="permissions${rename_pascalCase}"
				:records="records"
				:pagination="pagination"
				:is-loading="isLoading"
				:form-loading="formLoading"
				@delete-form="onDeleteForm"
				@change-page="onChangePage"
			/>
		</div>
	</div>
</template>

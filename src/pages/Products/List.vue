<script setup lang="ts">
import { ref } from "vue"
import { ProductApi } from "@/api"
import { ApiInterfaces, ProductInterfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import { rowsPerPageOptions } from "@/utils/_S9/helperDataTable"

// Component
import TableList from "./partials/TableList.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsProduct = routerPermissions({
	permissionRoute: "products",
	permissionName: "list",
})

const isLoading = ref<boolean>(false)
const formLoading = ref<boolean>(true)

const records = ref<ProductInterfaces.Product[]>([])
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
			permissionsProduct.list
				? ProductApi.getProducts(pagination.value)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			pagination.value = {}
			records.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<ProductInterfaces.Product>
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

const onDeleteForm = (productId: number) => {
	if (!permissionsProduct.del) return
	formLoading.value = true
	ProductApi.deleteProduct(productId)
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
		<div class="grid grid-cols-12 gap-6 mt-10">
			<TableList
				:permissions="permissionsProduct"
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

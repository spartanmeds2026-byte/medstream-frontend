<script setup lang="ts">
import { ref } from "vue"
import { PurchaseHistoryApi } from "@/api"
import { ApiInterfaces, PurchaseHistoryInterfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"
import { rowsPerPageOptions } from "@/utils/_S9/helperDataTable"

// Component
import TableList from "./partials/TableList.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsPurchaseHistory = routerPermissions({
	permissionRoute: "purchase_history",
	permissionName: "list",
})

const isLoading = ref<boolean>(false)
const formLoading = ref<boolean>(false)

const records = ref<PurchaseHistoryInterfaces.PurchaseHistory[]>([])
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
			permissionsPurchaseHistory.list
				? PurchaseHistoryApi.getPurchaseHistorys(pagination.value)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			pagination.value = {}
			records.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<PurchaseHistoryInterfaces.PurchaseHistory>
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
</script>

<template>
	<div>
		<div
			class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap"
		>
			<h2 class="text-lg font-medium">Purchase History</h2>
			<div class="ml-auto" />
		</div>
		<div class="grid grid-cols-12 gap-6 mt-5">
			<TableList
				:permissions="permissionsPurchaseHistory"
				:records="records"
				:pagination="pagination"
				:is-loading="isLoading"
				:form-loading="formLoading"
				@change-page="onChangePage"
			/>
		</div>
	</div>
</template>

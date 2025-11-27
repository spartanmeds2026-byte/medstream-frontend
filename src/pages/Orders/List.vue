<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { OrderApi } from "@/api"
import { ApiInterfaces, OrderInterfaces } from "@/interfaces"
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
const permissionsOrder = routerPermissions({
	permissionRoute: "orders",
	permissionName: "list",
})

const router = useRouter()
const isLoading = ref<boolean>(false)
const formLoading = ref<boolean>(false)

const records = ref<OrderInterfaces.Order[]>([])
const pagination = ref<ApiInterfaces.Meta>({
	page: 1,
	limit: rowsPerPageOptions[0],
	total: rowsPerPageOptions[0],
	sortField: "created_at",
	sortOrder: -1,
})

const getRecords = async () => {
	try {
		formLoading.value = true

		const requests = [
			permissionsOrder.list
				? OrderApi.getOrders(pagination.value)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			pagination.value = {}
			records.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<OrderInterfaces.Order>
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

const onDeleteForm = (orderId: number) => {
	if (!permissionsOrder.del) return
	formLoading.value = true
	OrderApi.deleteOrder(orderId)
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
			<h2 class="text-lg font-medium">Orders</h2>
			<div class="ml-auto" />
			<Button
				v-if="permissionsOrder.create"
				variant="primary"
				class="shadow-md"
				@click="() => router.push({ name: 'order-create' })"
			>
				Add New Order
			</Button>
		</div>
		<div class="grid grid-cols-12 gap-6 mt-5">
			<TableList
				:permissions="permissionsOrder"
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

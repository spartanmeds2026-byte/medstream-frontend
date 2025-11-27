<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { ApiInterfaces, OrderInterfaces } from "@/interfaces"
import { OrderApi } from "@/api"
import { useRouter } from "vue-router"
import { LoadingTemplate } from "@/utils/_S9/helperDataTable"
import {
	formatCurrency,
	formatDate,
	responseDefaultError,
} from "@/utils/_S9/helper"

// Component
import Button from "@/components/Base/Button"
import Skeleton from "primevue/skeleton"
import DataTable from "primevue/datatable"
import Column from "primevue/column"

const router = useRouter()
const isLoading = ref(false)
const pagination = ref<ApiInterfaces.Meta>({
	page: 1,
	limit: 10,
	total: 10,
	sortField: "id",
	sortOrder: -1,
})
const records = ref<OrderInterfaces.Order[]>([])

const getRecords = () => {
	isLoading.value = true
	OrderApi.getOrders(pagination.value)
		.then((response) => {
			records.value = response.results
		})
		.finally(() => {
			isLoading.value = false
		})
}

onBeforeMount(async () => {
	try {
		isLoading.value = true
		await Promise.all([getRecords()])
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoading.value = false
	}
})

const onRowClick = (event: any) => {
	const targetElement = event.originalEvent.target
	if (targetElement.closest(".prevent-row-click")) return
	if (targetElement.getAttribute("data-pc-section") == "rowtogglericon") return
	return router.push({
		name: "order",
		params: { orderId: event.data.id },
	})
}
</script>
<template>
	<div class="flex items-center h-10 intro-y">
		<h2 class="mr-5 text-lg font-medium truncate">My Recent Orders</h2>
		<div class="ml-auto" />
		<Button
			variant="primary"
			class="shadow-md"
			@click="() => router.push({ name: 'orders' })"
		>
			See All Orders
		</Button>
	</div>
	<div class="mt-5 intro-y overflow-hidden box">
		<template v-if="isLoading">
			<Skeleton height="14rem" class="col-span-12 intro-y" />
		</template>
		<template v-else>
			<DataTable
				selection-mode="single"
				:value="records"
				striped-rows
				resizable-columns
				removable-sort
				size="small"
				@row-click="onRowClick"
			>
				<template #empty> No records found. </template>
				<template #loading><LoadingTemplate /></template>
				<Column header="Order #" class="pl-4">
					<template #body="{ data }">
						{{ data.order_number }}
					</template>
				</Column>
				<Column header="Customer">
					<template #body="{ data }">
						{{ data.data.customer1?.name }}
					</template>
				</Column>
				<Column header="Order Date">
					<template #body="{ data }">
						{{ formatDate(data.created_at) }}
					</template>
				</Column>
				<Column header="Order Total">
					<template #body="{ data }">
						{{ formatCurrency(data.total) }}
					</template>
				</Column>
			</DataTable>
		</template>
	</div>
</template>

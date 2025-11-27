<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { ApiInterfaces, ProductInterfaces } from "@/interfaces"
import { ProductApi } from "@/api"
import { useRouter } from "vue-router"
import { LoadingTemplate } from "@/utils/_S9/helperDataTable"
import { formatCurrency } from "@/utils/_S9/helper"

// Components
import Img from "@/components/_S9/Img.vue"
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
const records = ref<ProductInterfaces.Product[]>([])

const getRecords = () => {
	isLoading.value = true
	ProductApi.getFeaturedProducts(pagination.value)
		.then((response) => {
			records.value = response.results
		})
		.finally(() => {
			isLoading.value = false
		})
}

onBeforeMount(() => {
	getRecords()
})

const onRowClick = (event: any) => {
	const targetElement = event.originalEvent.target
	if (targetElement.closest(".prevent-row-click")) return
	if (targetElement.getAttribute("data-pc-section") == "rowtogglericon") return
	return router.push({
		name: "product",
		params: { productId: event.data.id },
	})
}
</script>

<template>
	<div class="flex items-center h-10 intro-y">
		<h2 class="text-lg font-medium">Featured</h2>
		<div class="ml-auto" />
		<Button
			variant="primary"
			class="shadow-md"
			@click="() => router.push({ name: 'products' })"
		>
			See All Products
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
				<Column header="Image" class="pl-4">
					<template #body="{ data }">
						<Img
							class="aspect-square object-cover !w-[3.5rem] !h-[3.5rem] rounded"
							:src="data.image"
							:alt="data.sku"
						/>
					</template>
				</Column>
				<Column field="sku" header="SKU" />
				<Column field="title" header="Name" />

				<Column field="customer_price" data-type="numeric" header="Your Price">
					<template #body="{ data }">
						{{ formatCurrency(data.customer_price) }}
					</template>
				</Column>
				<Column
					field="quantity"
					data-type="numeric"
					header="Available"
					class="pr-4"
				>
					<template #body="{ data }">
						{{ data.quantity }}
					</template>
				</Column>
			</DataTable>
		</template>
	</div>
</template>

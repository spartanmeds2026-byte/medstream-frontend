<script setup lang="ts">
import _ from "lodash"
import { computed, onMounted, ref, watch } from "vue"
import { FilterMatchMode, FilterOperator } from "primevue/api"
import {
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
	ProductInterfaces,
} from "@/interfaces"
import {
	rowsPerPageOptions,
	paginatorTemplate,
	currentPageReportTemplate,
	LoadingTemplate,
} from "@/utils/_S9/helperDataTable"
import { formatDate } from "@/utils/_S9/helper"
import { useRouter } from "vue-router"
import { formatCurrency } from "@/utils/_S9/helper"

// Component
import Lucide from "@/components/Base/Lucide"
import DataTable from "primevue/datatable"
import Button from "@/components/Base/Button"
import InputText from "primevue/inputtext"
import { FormInput } from "@/components/Base/Form"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"

const filters = ref()

const props = withDefaults(
	defineProps<{
		hideColumns?: string[]
		permissions: RolesAndPermissionsInterfaces.Permission
		pagination?: ApiInterfaces.Meta
		records: ProductInterfaces.LogOrder[]
		isLoading: boolean
		formLoading: boolean
	}>(),
	{
		pagination: undefined,
		companies: () => [],
		locations: () => [],
		hideColumns: () => [],
	}
)

const stateKey = "dt-log-order-list"
const router = useRouter()
const emit = defineEmits(["showForm", "updateForm", "deleteForm", "changePage"])

const recordsWithCustomFields = computed(() => props.records)

const pagination = computed(() => {
	return {
		page: props.pagination?.page || 1,
		limit: props.pagination?.limit || rowsPerPageOptions[0],
		total: props.pagination?.total || rowsPerPageOptions[0],
		sortField: props.pagination?.sortField || "id",
		sortOrder: props.pagination?.sortOrder || -1,
	}
})

const onChangeState = (event: any) => {
	emit("changePage", {
		limit: event.rows,
		page: (event.first + event.rows) / event.rows,
		sortField: event.sortField,
		sortOrder: event.sortOrder,
		filters: event.filters,
	})
}

watch(
	() => filters.value?.["global"].value,
	_.debounce(() => {
		onChangeState({
			rows: pagination.value.limit,
			first: 0,
			filters: filters.value,
			sortField: pagination.value.sortField,
			sortOrder: pagination.value.sortOrder,
		})
	}, 1000)
)

onMounted(() => {
	if (!localStorage.getItem(stateKey))
		onChangeState({ rows: pagination.value.limit, first: 0 })
})

const clearFilter = () => {
	initFilters()
	onChangeState({
		rows: rowsPerPageOptions[0],
		first: 0,
		sortField: "id",
		sortOrder: -1,
	})
}

const initFilters = () => {
	filters.value = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		created_at: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		quantity: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		"orders.order_number": {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		price: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		total: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
	}
}

initFilters()

const onRowClick = (event: any) => {
	const targetElement = event.originalEvent.target
	if (targetElement.closest(".prevent-row-click")) return
	if (targetElement.getAttribute("data-pc-section") == "rowtogglericon") return
	if (props.permissions.read)
		return router.push({
			name: "order",
			params: { orderId: event.data.order_id },
		})
}
</script>
<template>
	<template v-if="isLoading">
		<Skeleton height="34rem" class="col-span-12 intro-y" />
	</template>
	<template v-else>
		<div class="intro-y col-span-12">
			<div class="box overflow-hidden">
				<DataTable
					v-model:filters="filters"
					selection-mode="single"
					:value="recordsWithCustomFields"
					state-storage="local"
					:state-key="stateKey"
					paginator
					:loading="formLoading"
					:lazy="!!props.pagination"
					:rows="pagination.limit"
					:sort-field="pagination.sortField"
					:sort-order="pagination.sortOrder"
					:rows-per-page-options="rowsPerPageOptions"
					:total-records="pagination.total"
					:paginator-template="paginatorTemplate"
					:current-page-report-template="currentPageReportTemplate"
					striped-rows
					resizable-columns
					removable-sort
					filter-display="menu"
					data-key="id"
					size="small"
					:global-filter-fields="['created_at', 'order_id', 'quantity']"
					@row-click="onRowClick"
					@state-restore="onChangeState"
					@filter="onChangeState"
					@sort="onChangeState"
					@page="onChangeState"
				>
					<template #header>
						<div class="flex justify-between">
							<Button
								variant="outline-primary"
								class="w-24 mb-2 mr-1"
								@click="clearFilter()"
							>
								<Lucide icon="FilterIcon" class="w-4 h-4 mr-2" />
								Clear
							</Button>
							<span class="relative">
								<i
									class="pi pi-search absolute top-2/4 -mt-2.5 left-3 text-surface-400 dark:text-surface-600"
								/>
								<FormInput
									v-model="filters['global'].value"
									placeholder="Search"
									class="pl-10 font-normal"
								/>
							</span>
						</div>
					</template>
					<template #empty> No records found. </template>
					<template #loading><LoadingTemplate /></template>
					<Column
						v-if="!hideColumns.includes('created_at')"
						sortable
						field="created_at"
						header="Date"
						class="pl-4"
					>
						<template #body="{ data }">
							{{ formatDate(data.created_at) }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Date"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('order_number')"
						sortable
						field="orders.order_number"
						header="Order #"
					>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Order #"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('price')"
						sortable
						field="price"
						header="Price"
					>
						<template #body="{ data }">
							{{ formatCurrency(data.price) }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Price"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('quantity')"
						sortable
						field="quantity"
						header="Quantity"
					>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Quantity"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('total')"
						sortable
						field="total"
						header="Total"
					>
						<template #body="{ data }">
							{{ formatCurrency(data.total) }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Total"
							/>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
	</template>
</template>

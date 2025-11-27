<script setup lang="ts">
import _ from "lodash"
import { computed, ref, watch } from "vue"
import { FilterMatchMode, FilterOperator } from "primevue/api"
import {
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
	ProductInterfaces,
} from "@/interfaces"
import { useConfirm } from "primevue/useconfirm"
import { MenuItem } from "primevue/menuitem"
import { ConfirmationOptions } from "primevue/confirmationoptions"
import { useRoute, useRouter } from "vue-router"
import {
	rowsPerPageOptions,
	paginatorTemplate,
	currentPageReportTemplate,
	LoadingTemplate,
} from "@/utils/_S9/helperDataTable"
import { formatCurrency } from "@/utils/_S9/helper"

// Component
import Img from "@/components/_S9/Img.vue"
import Lucide from "@/components/Base/Lucide"
import DataTable from "primevue/datatable"
import Button from "@/components/Base/Button"
import InputText from "primevue/inputtext"
import { FormInput } from "@/components/Base/Form"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import ContextMenu from "primevue/contextmenu"

interface ExtendedConfirmationOptions extends ConfirmationOptions {
	body?: Record<string, any>
}

const filters = ref()

const props = withDefaults(
	defineProps<{
		hideColumns?: string[]
		permissions: RolesAndPermissionsInterfaces.Permission
		pagination?: ApiInterfaces.Meta
		records: ProductInterfaces.Product[]
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

const route = useRoute()
const router = useRouter()
const emit = defineEmits(["showForm", "updateForm", "deleteForm", "changePage"])
const categoryId = Number.parseInt(route.query.categoryId as string, 10)

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
		id: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		item_number: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		sku: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		customer_price: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
		quantity: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
		},
		category_id: {
			operator: FilterOperator.AND,
			constraints: [
				{ value: categoryId || null, matchMode: FilterMatchMode.EQUALS },
			],
		},
	}
}

initFilters()

const confirm = useConfirm()
const confirmDeleteRow = (item: ProductInterfaces.Product) => {
	confirm.require({
		group: "headlessDeleteItem",
		header: "Do you want to delete this record?",
		message: "Please confirm to proceed.",
		body: {
			id: item.id,
			sku: item.sku,
			default_price: item.default_price,
		},
		accept: () => {
			emit("deleteForm", item.id)
		},
		reject: () => {},
	} as ExtendedConfirmationOptions)
}

const cm = ref()
const selectedRow = ref()
const menuModel = ref<MenuItem[]>([])

const onRowContextMenu = (event: any) => {
	cm.value.show(event.originalEvent)
}

const onRowClick = (event: any) => {
	const targetElement = event.originalEvent.target
	if (targetElement.closest(".prevent-row-click")) return
	if (targetElement.getAttribute("data-pc-section") == "rowtogglericon") return
	if (props.permissions.read)
		return router.push({
			name: "product",
			params: { productId: event.data.id },
		})
}

if (props.permissions.read)
	menuModel.value.push({
		label: "View",
		icon: "pi pi-fw pi-eye",
		command: () =>
			router.push({
				name: "product",
				params: { productId: selectedRow.value.id },
			}),
	})

if (props.permissions.update)
	menuModel.value.push({
		label: "Edit",
		icon: "pi pi-fw pi-pencil",
		command: () =>
			router.push({
				name: "product-edit",
				params: { productId: selectedRow.value.id },
			}),
	})

if (props.permissions.del)
	menuModel.value.push({
		label: "Delete",
		icon: "pi pi-fw pi-trash",
		command: () => confirmDeleteRow(selectedRow.value),
	})
</script>
<template>
	<template v-if="isLoading">
		<Skeleton height="34rem" class="col-span-12 intro-y" />
	</template>
	<template v-else>
		<div class="intro-y col-span-12">
			<div class="box overflow-hidden">
				<ContextMenu ref="cm" :model="menuModel" @hide="selectedRow = null" />
				<DataTable
					v-model:filters="filters"
					v-model:context-menu-selection="selectedRow"
					selection-mode="single"
					:value="recordsWithCustomFields"
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
					:global-filter-fields="['sku', 'default_price', 'custom_price']"
					context-menu
					@row-click="onRowClick"
					@state-restore="onChangeState"
					@filter="onChangeState"
					@sort="onChangeState"
					@page="onChangeState"
					@row-contextmenu="onRowContextMenu"
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
						v-if="!hideColumns.includes('image')"
						header="Image"
						class="w-10 pl-4 prevent-row-click"
					>
						<template #body="{ data }">
							<Img
								class="aspect-square object-cover !min-w-16 !w-16 !h-16 rounded"
								:src="data.image || null"
								:alt="data.sku"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('title')"
						sortable
						field="title"
						header="Title"
					>
						<template #body="{ data }">
							{{ data.title }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Title"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('sku')"
						sortable
						field="sku"
						header="SKU"
					>
						<template #body="{ data }">
							{{ data.sku }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by SKU"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('customer_price')"
						field="customer_price"
						data-type="numeric"
						sortable
						header="Your Price"
					>
						<template #body="{ data }">
							{{ formatCurrency(data.customer_price) }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Customer Price"
							/>
						</template>
					</Column>
					<Column
						v-if="!hideColumns.includes('available')"
						field="quantity"
						data-type="numeric"
						header="Available"
						sortable
						class="pr-4"
					>
						<template #body="{ data }">
							{{ data.quantity }}
						</template>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by Available"
							/>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
	</template>
</template>

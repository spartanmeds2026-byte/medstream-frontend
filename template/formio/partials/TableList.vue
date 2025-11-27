<script setup lang="ts">
import _ from "lodash"
import { computed, onMounted, ref, watch } from "vue"
import { FilterMatchMode, FilterOperator } from "primevue/api"
import {
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
	${rename_pascalCase}Interfaces,
} from "@/interfaces"
import { useConfirm } from "primevue/useconfirm"
import { MenuItem } from "primevue/menuitem"
import { ConfirmationOptions } from "primevue/confirmationoptions"
import { useRouter } from "vue-router"
import {
	rowsPerPageOptions,
	paginatorTemplate,
	currentPageReportTemplate,
	LoadingTemplate,
} from "@/utils/_S9/helperDataTable"

// Component
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
		records: ${rename_pascalCase}Interfaces.${rename_pascalCase}[]
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

const stateKey = "dt-${rename_kebabCase}s-list"
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
		id: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
		name: {
			operator: FilterOperator.AND,
			constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
		},
	}
}

initFilters()

const confirm = useConfirm()
const confirmDeleteRow = (item: ${rename_pascalCase}Interfaces.${rename_pascalCase}) => {
	confirm.require({
		group: "headlessDeleteItem",
		header: "Do you want to delete this record?",
		message: "Please confirm to proceed.",
		body: {
			id: item.id,
			name: item.name,
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
			name: "${rename_kebabCase}",
			params: { ${rename_camelCase}Id: event.data.id },
		})
}

if (props.permissions.read)
	menuModel.value.push({
		label: "View",
		icon: "pi pi-fw pi-eye",
		command: () =>
			router.push({
				name: "${rename_kebabCase}",
				params: { ${rename_camelCase}Id: selectedRow.value.id },
			}),
	})

if (props.permissions.update)
	menuModel.value.push({
		label: "Edit",
		icon: "pi pi-fw pi-pencil",
		command: () =>
			router.push({
				name: "${rename_kebabCase}-edit",
				params: { ${rename_camelCase}Id: selectedRow.value.id },
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
					:global-filter-fields="['id', 'name']"
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
					<Column sortable field="id" header="ID" class="w-10 pl-4" />
					<Column
						v-if="!hideColumns.includes('name')"
						sortable
						field="name"
						header="${rename_pascalCase} Name"
					>
						<template #filter="{ filterModel }">
							<InputText
								v-model="filterModel.value"
								type="text"
								class="w-full"
								placeholder="Search by ${rename_pascalCase} Name"
							/>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
	</template>
</template>

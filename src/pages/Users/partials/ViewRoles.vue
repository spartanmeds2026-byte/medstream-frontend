<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue"
import {
	UserInterfaces,
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
} from "@/interfaces"
import { RolesAndPermissionsApi } from "@/api"
import { responseDefaultError } from "@/utils/_S9/helper"

// Component
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import { LoadingTemplate } from "@/utils/_S9/helperDataTable"

// Permission
import { hasPermissions } from "@/utils/_S9/permissions"

const props = withDefaults(
	defineProps<{
		user: UserInterfaces.User
		permissions: RolesAndPermissionsInterfaces.Permission
		isLoading: boolean
	}>(),
	{}
)

const isLoadingApi = ref(false)
const isLoading = computed(() => {
	return props.isLoading || isLoadingApi.value
})

const userRoles = ref<RolesAndPermissionsInterfaces.Role[]>([])
const roles = ref<RolesAndPermissionsInterfaces.Role[]>([])

onBeforeMount(() => {
	getRecords()
})

const getRecords = async () => {
	try {
		isLoadingApi.value = true
		const requests = [
			hasPermissions("roles").list
				? RolesAndPermissionsApi.getRoles()
				: Promise.resolve([]),
			props.permissions.list
				? RolesAndPermissionsApi.getRolesByUser(props.user.id)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			roles.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<RolesAndPermissionsInterfaces.Role>
			roles.value = response.results
		}

		if (results[1].status !== "fulfilled") {
			userRoles.value = []
		} else {
			const response = results[1].value as RolesAndPermissionsInterfaces.Role[]
			userRoles.value = response
		}
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoadingApi.value = false
	}
}
</script>

<template>
	<div class="grid grid-cols-12 gap-6">
		<!-- BEGIN: List Role -->
		<div class="col-span-4 intro-y box lg:col-span-6">
			<template v-if="isLoading">
				<Skeleton height="34rem" class="intro-y" />
			</template>
			<template v-else>
				<div
					class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
				>
					<h2 class="mr-auto text-base font-medium">Role List</h2>
				</div>
				<div>
					<DataTable
						selection-mode="single"
						:value="userRoles"
						striped-rows
						resizable-columns
						removable-sort
						filter-display="menu"
						data-key="id"
						size="small"
					>
						<template #empty> No records found. </template>
						<template #loading><LoadingTemplate /></template>
						<Column sortable field="name" header="Role">
							<template #body="{ data }">
								{{ data.name }}
							</template>
						</Column>
					</DataTable>
				</div>
				<div class="h-4" />
			</template>
		</div>
	</div>
</template>

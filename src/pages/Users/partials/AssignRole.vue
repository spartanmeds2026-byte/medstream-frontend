<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, toRefs, watch } from "vue"
import {
	UserInterfaces,
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
} from "@/interfaces"
import { RolesAndPermissionsApi } from "@/api"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required } from "@vuelidate/validators"
import { useConfirm } from "primevue/useconfirm"
import { MenuItem } from "primevue/menuitem"
import { ConfirmationOptions } from "primevue/confirmationoptions"

// Component
import DataTable from "primevue/datatable"
import Button from "@/components/Base/Button"
import { FormLabel, FormSelect } from "@/components/Base/Form"
import SkeletonForm from "./SkeletonForm.vue"
import Column from "primevue/column"
import Skeleton from "primevue/skeleton"
import ContextMenu from "primevue/contextmenu"
import { LoadingTemplate } from "@/utils/_S9/helperDataTable"

// Permission
import { hasPermissions } from "@/utils/_S9/permissions"

interface ExtendedConfirmationOptions extends ConfirmationOptions {
	body?: Record<string, any>
}

const props = withDefaults(
	defineProps<{
		user: UserInterfaces.User
		permissions: RolesAndPermissionsInterfaces.Permission
		formLoading: boolean
		isLoading: boolean
		formReset: boolean
	}>(),
	{}
)

const emit = defineEmits(["submitForm", "deleteForm"])
const isLoadingApi = ref(false)
const isLoading = computed(() => {
	return props.isLoading || isLoadingApi.value
})

const userRoles = ref<RolesAndPermissionsInterfaces.Role[]>([])
const roles = ref<RolesAndPermissionsInterfaces.Role[]>([])

const formData = reactive({
	userId: props.user.id,
	roleId: null,
})

const rules = {
	userId: {
		required,
	},
	roleId: {
		required,
	},
}

const validate = useVuelidate(rules, toRefs(formData))

onBeforeMount(() => {
	getRecords()
})

const onSubmitForm = () => {
	validate.value.$touch()
	if (validate.value.$invalid) {
		responseDefaultError("form_check")
	} else {
		emit("submitForm", { ...formData })
	}
}

const initForm = () => {
	formData.userId = props.user.id
	formData.roleId = null

	getRecords()
	validate.value.$reset()
}

watch(
	() => props.user,
	() => {
		initForm()
	},
	{ deep: true }
)

watch(
	() => props.formReset,
	() => {
		initForm()
	}
)

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

const confirm = useConfirm()
const confirmDeleteRow = (item: RolesAndPermissionsInterfaces.Role) => {
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

if (props.permissions.del)
	menuModel.value.push({
		label: "Delete",
		icon: "pi pi-fw pi-trash",
		command: () => confirmDeleteRow(selectedRow.value),
	})
</script>

<template>
	<div class="grid grid-cols-12 gap-6">
		<!-- BEGIN: List Role -->
		<div class="col-span-4 lg:col-span-6">
			<template v-if="isLoading">
				<Skeleton height="34rem" class="intro-y box" />
			</template>
			<template v-else>
				<div class="intro-y box">
					<div
						class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
					>
						<h2 class="mr-auto text-base font-medium">Role List</h2>
					</div>
					<div>
						<ContextMenu
							ref="cm"
							:model="menuModel"
							@hide="selectedRow = null"
						/>
						<DataTable
							v-model:context-menu-selection="selectedRow"
							selection-mode="single"
							:value="userRoles"
							:loading="formLoading"
							striped-rows
							resizable-columns
							removable-sort
							filter-display="menu"
							data-key="id"
							size="small"
							context-menu
							@row-contextmenu="onRowContextMenu"
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
				</div>
			</template>
		</div>
		<!-- BEGIN: Update Role -->
		<div class="col-span-4 lg:col-span-6">
			<div class="intro-y box">
				<div
					class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
				>
					<h2 class="mr-auto text-base font-medium">Assign Roles</h2>
				</div>
				<div class="p-5">
					<!-- BEGIN: Validation Form -->
					<form class="validate-form" @submit.prevent="onSubmitForm">
						<template v-if="isLoading || !user">
							<SkeletonForm />
						</template>
						<template v-else>
							<div class="input-form">
								<FormLabel
									html-for="role"
									class="flex flex-col w-full sm:flex-row"
								>
									Role
								</FormLabel>
								<FormSelect
									id="role"
									v-model="validate.roleId.$model"
									placeholder="Select role"
									:class="{ 'border-danger': validate.roleId.$error }"
									class="w-full"
								>
									<option
										v-for="role in roles"
										:key="role.id"
										:value="role.id"
										v-text="role.name"
									/>
								</FormSelect>
								<template v-if="validate.roleId.$error">
									<div
										v-for="(error, index) in validate.roleId.$errors"
										:key="index"
										class="mt-2 text-danger"
									>
										"<span class="uppercase">{{ error.$property }}</span
										>" {{ error.$message }}
									</div>
								</template>
							</div>

							<Button
								variant="primary"
								type="submit"
								class="mt-5"
								:disabled="formLoading"
							>
								Assign
							</Button>
						</template>
					</form>
					<!-- END: Validation Form -->
				</div>
			</div>
		</div>
	</div>
</template>

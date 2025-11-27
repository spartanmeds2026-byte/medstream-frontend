<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { UserApi } from "@/api"
import { UserInterfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"

// Component
import Button from "@/components/Base/Button"
import { Dialog } from "@/components/Base/Headless"
import TableList from "./partials/TableList.vue"
import CreateForm from "./partials/CreateForm.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsUser = routerPermissions({ permissionName: "list" })

const router = useRouter()
const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formReset = ref<boolean>(false)
const records = ref<UserInterfaces.User[]>([])

const modalCreateForm = ref(false)
const setModalCreateForm = (value: boolean) => {
	if (permissionsUser.create) modalCreateForm.value = value
}

const getRecords = async () => {
	isLoading.value = true
	UserApi.getUsers()
		.then((response) => {
			records.value = response.results
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			isLoading.value = false
		})
}

const onSubmitCreateForm = (user: UserInterfaces.User) => {
	if (!permissionsUser.create) return
	formLoading.value = true
	UserApi.createUser(user)
		.then((response) => {
			getRecords()
			responseDefaultSuccess("created")
			setModalCreateForm(false)
			onResetForm()
			router.push({ name: "user", params: { userId: response.id } })
		})
		.catch((error) => {
			responseDefaultError(error)
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onDeleteForm = (userId: number) => {
	if (!permissionsUser.del) return
	formLoading.value = true
	UserApi.deleteUser(userId)
		.then(() => {
			getRecords()
			responseDefaultSuccess("deleted")
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const onResetForm = () => {
	formReset.value = !formReset.value
}

onMounted(() => {
	getRecords()
})
</script>

<template>
	<div>
		<div
			class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap"
		>
			<h2 class="text-lg font-medium">Users</h2>
			<div class="ml-auto" />
			<Button
				v-if="permissionsUser.create"
				variant="primary"
				type="button"
				class="shadow-md"
				@click="() => setModalCreateForm(true)"
			>
				Add New User
			</Button>
		</div>

		<div class="grid grid-cols-12 gap-6 mt-5">
			<TableList
				:permissions="permissionsUser"
				:records="records"
				:is-loading="isLoading"
				:form-loading="formLoading"
				@delete-form="onDeleteForm"
			/>
		</div>
	</div>

	<!-- BEGIN: Modal Content -->
	<Dialog
		:open="modalCreateForm"
		@close="
			() => {
				setModalCreateForm(false)
			}
		"
	>
		<Dialog.Panel>
			<Dialog.Title>
				<h2 class="mr-auto text-base font-medium">Create New User</h2>
			</Dialog.Title>
			<Dialog.Description>
				<CreateForm
					:is-loading="isLoading"
					:form-loading="formLoading"
					:form-reset="formReset"
					@submit-form="onSubmitCreateForm"
				/>
			</Dialog.Description>
		</Dialog.Panel>
	</Dialog>
	<!-- END: Modal Content -->
</template>

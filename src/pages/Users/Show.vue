<script setup lang="ts">
import { defaultPermission } from "@/defaultConfig"
import { useRoute, useRouter } from "vue-router"
import { ref, onBeforeMount, computed } from "vue"
import { UserApi, AuthApi } from "@/api"
import { UserInterfaces } from "@/interfaces"
import {
	responseDefaultError,
	avatarPreview,
	responseDefaultSuccess,
} from "@/utils/_S9/helper"
import { useConfirm } from "primevue/useconfirm"
import { ConfirmationOptions } from "primevue/confirmationoptions"

// Component
import Lucide from "@/components/Base/Lucide"
import { Tab } from "@/components/Base/Headless"
import { Dialog } from "@/components/Base/Headless"
import Skeleton from "primevue/skeleton"
import ViewForm from "./partials/ViewForm.vue"
import ViewRoles from "./partials/ViewRoles.vue"
import Button from "@/components/Base/Button"
import { FormSwitch } from "@/components/Base/Form"
import LinkToCustomerForm from "./partials/LinkToCustomerForm.vue"

// Permission
import { routerPermissions, hasPermissions } from "@/utils/_S9/permissions"
const permissionsUser = routerPermissions({
	permissionRoute: "users",
	permissionName: "read",
})
const permissionsManageUserRole = hasPermissions("manage_user_roles")
const permissionsSimulateLogin = hasPermissions("login_simulations")

interface ExtendedConfirmationOptions extends ConfirmationOptions {
	body?: Record<string, any>
}

const confirm = useConfirm()
const confirmSimulateLogin = () => {
	confirm.require({
		group: "headlessConfirmItem",
		header: "Do you want to view as this user?",
		message: "Please confirm to proceed.",
		body: {
			id: record.value?.id,
			first_name: record.value?.first_name,
			email: record.value?.email,
		},
		accept: () => {
			formLoading.value = true
			AuthApi.simulateLogin(userId).then(() => {
				location.href = router.resolve({
					name: "dashboard",
				}).fullPath
			})
		},
		reject: () => {},
	} as ExtendedConfirmationOptions)
}

const route = useRoute()
const router = useRouter()
const userId = Number.parseInt(route.params.userId as string, 10)

const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const record = ref<UserInterfaces.User | null>(null)

const getUser = async () => {
	isLoading.value = true
	UserApi.getUserById(userId)
		.then((response) => {
			record.value = response
			isLoading.value = false
		})
		.catch((error) => responseDefaultError(error))
}

const assignAdminRoleToUser = async () => {
	if (!record.value) return

	formLoading.value = true
	UserApi.assignAdminRoleToUser(userId)
		.then((response) => {
			getUser()
			responseDefaultSuccess(response)
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const getUserName = computed(() => {
	if (!record.value) return ""
	const { first_name } = record.value
	return `${first_name}`.trim()
})

const getUserAvatar = computed(() => {
	if (!record.value) return ""
	const { picture } = record.value
	return picture || ""
})

const getUserRole = computed(() => {
	if (!record.value) return ""
	const { role } = record.value
	return role?.name || ""
})

const getUserEmail = computed(() => {
	if (!record.value) return ""
	const { email } = record.value
	return email
})

const getUserPhone = computed(() => {
	if (!record.value) return ""
	const { client } = record.value
	return client?.phone
})

const getUserAddress = computed(() => {
	if (!record.value) return ""
	const { client } = record.value
	return client?.address
})

// const inviteProcess = () => {
// 	UserApi.inviteUser(userId)
// 		.then(() => {
// 			responseDefaultSuccess("send")
// 		})
// 		.catch((error) => responseDefaultError(error))
// }

const modalLinkToCustomer = ref<boolean>(false)
const onSubmitLinkToCustomer = (customerId: number) => {
	modalLinkToCustomer.value = false
	formLoading.value = true
	UserApi.assignUserToCustomer(userId, customerId)
		.then((response) => {
			getUser()
			responseDefaultSuccess(response)
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const unlinkToCustomer = async () => {
	if (!record.value) return
	formLoading.value = true
	UserApi.unassignUserToCustomer(userId)
		.then((response) => {
			getUser()
			responseDefaultSuccess(response)
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

onBeforeMount(() => {
	getUser()
})
</script>

<template>
	<div
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Show User</h2>

		<Button
			v-if="permissionsUser.update && !record?.client"
			class="min-w-20"
			variant="primary"
			@click="() => (modalLinkToCustomer = true)"
		>
			Link to Customer
		</Button>

		<Button
			v-else
			class="min-w-20"
			variant="primary"
			@click="() => unlinkToCustomer()"
		>
			Unlink from Customer
		</Button>

		<Button
			v-if="permissionsSimulateLogin.update"
			class="min-w-20"
			variant="primary"
			@click="() => confirmSimulateLogin()"
		>
			View as {{ getUserName }}
		</Button>
		<Button
			v-if="permissionsUser.update"
			class="min-w-20"
			variant="primary"
			@click="() => router.push({ name: 'user-edit', params: { userId } })"
		>
			Edit
		</Button>
	</div>
	<Tab.Group>
		<!-- BEGIN: Profile Info -->
		<div class="px-5 pt-5 mt-5 intro-y box">
			<div
				class="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400"
			>
				<div
					class="flex items-center justify-center flex-1 px-5 lg:justify-start"
				>
					<!-- BEGIN: Profile Photo -->
					<div
						class="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit"
					>
						<template v-if="isLoading">
							<Skeleton height="100%" shape="circle" />
						</template>
						<template v-else>
							<img
								class="rounded-full"
								:src="avatarPreview(getUserAvatar || getUserName)"
								:alt="getUserName"
							/>
						</template>
					</div>
					<!-- END: Profile Photo -->
					<div class="ml-5">
						<template v-if="isLoading">
							<Skeleton height="1.6rem" width="8rem" class="mb-2" />
							<Skeleton height="1.3rem" width="6rem" />
						</template>
						<template v-else>
							<div class="text-lg font-medium truncate sm:whitespace-normal">
								{{ getUserName }}
							</div>
							<div class="text-slate-500">
								{{ getUserRole }}
							</div>

							<div class="mt-3">
								<FormSwitch v-if="permissionsUser.update" class="mt-2">
									<FormSwitch.Input
										id="user-admin-checkbox"
										type="checkbox"
										:model-value="record?.is_admin"
										@update:model-value="() => assignAdminRoleToUser()"
									/>
									<FormSwitch.Label html-for="user-admin-checkbox">
										Admin
									</FormSwitch.Label>
								</FormSwitch>
							</div>
						</template>
					</div>
				</div>
				<div
					class="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0"
				>
					<div class="font-medium text-center lg:text-left lg:mt-3">
						Contact Details
					</div>
					<div
						class="flex flex-col items-center justify-center mt-4 lg:items-start"
					>
						<div class="flex items-center truncate sm:whitespace-normal">
							<Lucide icon="Mail" class="min-w-4 min-h-4 mr-2" />
							<template v-if="isLoading">
								<Skeleton height="1.3rem" width="8rem" />
							</template>
							<template v-else>
								{{ getUserEmail }}
							</template>
						</div>
						<div class="flex items-center mt-3 truncate whitespace-normal">
							<Lucide icon="Phone" class="min-w-4 min-h-4 mr-2" />
							<template v-if="isLoading">
								<Skeleton height="1.3rem" width="8rem" />
							</template>
							<template v-else>
								{{ getUserPhone }}
							</template>
						</div>
						<div class="flex items-center mt-3 truncate whitespace-normal">
							<Lucide icon="MapPin" class="min-w-4 min-h-4 mr-2" />
							<template v-if="isLoading">
								<Skeleton height="1.3rem" width="8rem" />
							</template>
							<template v-else>
								{{ getUserAddress }}
							</template>
						</div>
					</div>
				</div>
			</div>
			<Tab.List
				variant="link-tabs"
				class="flex-col justify-center text-center sm:flex-row lg:justify-start"
			>
				<Tab v-if="permissionsUser.list" :full-width="false">
					<Tab.Button class="py-4 cursor-pointer">
						Account & Profile
					</Tab.Button>
				</Tab>
				<Tab
					v-if="defaultPermission && permissionsManageUserRole.list"
					:full-width="false"
				>
					<Tab.Button class="py-4 cursor-pointer">
						Roles & Permissions
					</Tab.Button>
				</Tab>
			</Tab.List>
		</div>
		<!-- END: Profile Info -->
		<Tab.Panels class="mt-5 intro-y">
			<!-- BEGIN: Update User  -->
			<Tab.Panel v-if="permissionsUser.list && record">
				<div class="grid grid-cols-12 gap-6">
					<!-- BEGIN: Update User -->
					<div class="col-span-12 intro-y box lg:col-span-6">
						<div
							class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
						>
							<h2 class="mr-auto text-base font-medium">Info User</h2>
						</div>
						<div class="p-5">
							<ViewForm :user="record" :is-loading="isLoading" />
						</div>
					</div>
					<!-- END: Update User -->
				</div>
			</Tab.Panel>
			<!-- Begin: Roles & Permissions -->
			<Tab.Panel
				v-if="defaultPermission && permissionsManageUserRole.list && record"
			>
				<ViewRoles
					:permissions="permissionsManageUserRole"
					:user="record"
					:is-loading="isLoading"
				/>
			</Tab.Panel>
		</Tab.Panels>
	</Tab.Group>

	<!-- Modal: Link to Customer -->
	<Dialog
		:open="modalLinkToCustomer"
		@close="() => (modalLinkToCustomer = false)"
	>
		<Dialog.Panel>
			<Dialog.Title>
				<h2 class="mr-auto text-base font-medium">Link to Customer</h2>
			</Dialog.Title>
			<Dialog.Description>
				<LinkToCustomerForm
					:form-loading="formLoading"
					@submit-form="onSubmitLinkToCustomer"
				/>
			</Dialog.Description>
		</Dialog.Panel>
	</Dialog>
</template>

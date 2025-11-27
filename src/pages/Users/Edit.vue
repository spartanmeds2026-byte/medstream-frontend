<script setup lang="ts">
import { defaultPermission } from "@/defaultConfig"
import { ref, onBeforeMount, computed } from "vue"
import { useRoute } from "vue-router"
import { RolesAndPermissionsApi, UserApi } from "@/api"
import { UserInterfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"

// Component
import Lucide from "@/components/Base/Lucide"
import { Tab } from "@/components/Base/Headless"
import Skeleton from "primevue/skeleton"
import UpdateForm from "./partials/UpdateForm.vue"
import AssignRole from "./partials/AssignRole.vue"
import ChangeAvatarPicture from "@/components/_S9/ChangeAvatarPicture.vue"

// Permission
import { routerPermissions, hasPermissions } from "@/utils/_S9/permissions"
const permissionsUser = routerPermissions({
	permissionRoute: "users",
	permissionName: "update",
})
const permissionsManageUserRole = hasPermissions("manage_user_roles")

const route = useRoute()
const userId = Number.parseInt(route.params.userId as string, 10)

const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formReset = ref<boolean>(false)
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

const getUserName = computed(() => {
	if (!record.value) return ""
	const { first_name, last_name } = record.value
	return `${first_name} ${last_name || ""}`.trim()
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
const onSubmitForm = (user: UserInterfaces.User) => {
	if (!permissionsUser.update) return
	formLoading.value = true
	UserApi.updateUser(userId, user)
		.then((response) => {
			record.value = response
			responseDefaultSuccess("updated")
		})
		.catch((error) => {
			responseDefaultError(error)
			onResetForm()
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onSubmitPicture = (picture: string) => {
	if (!permissionsUser.update) return
	formLoading.value = true
	UserApi.updateUser(userId, {
		...record.value,
		picture,
	} as UserInterfaces.User)
		.then((response) => {
			record.value = response
			responseDefaultSuccess("updated")
		})
		.catch((error) => {
			responseDefaultError(error)
			onResetForm()
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onSubmitRole = (assignRole: { userId: number; roleId: number }) => {
	if (!permissionsManageUserRole.update) return
	formLoading.value = true
	RolesAndPermissionsApi.AssignRoleToUser(assignRole)
		.then(() => {
			responseDefaultSuccess("updated")
		})
		.catch((error) => {
			responseDefaultError(error)
		})
		.finally(() => {
			formLoading.value = false
			onResetForm()
		})
}

const onDeleteRole = (roleId: number) => {
	if (!permissionsManageUserRole.del) return
	formLoading.value = true
	RolesAndPermissionsApi.deleteRoleToUser(userId, roleId)
		.then(() => {
			responseDefaultSuccess("deleted")
		})
		.catch((error) => {
			responseDefaultError(error)
		})
		.finally(() => {
			formLoading.value = false
			onResetForm()
		})
}

const onResetForm = () => {
	formReset.value = !formReset.value
}

onBeforeMount(() => {
	getUser()
})
</script>

<template>
	<div
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap"
	>
		<h2 class="mr-auto text-lg font-medium">User: {{ getUserName }}</h2>
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
					<ChangeAvatarPicture
						:picture="getUserAvatar"
						:name="getUserName"
						:is-loading="isLoading"
						:form-loading="formLoading"
						:form-reset="formReset"
						@submit-form="onSubmitPicture"
					/>
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
				<Tab v-if="permissionsUser.update" :full-width="false">
					<Tab.Button class="py-4 cursor-pointer">
						Account & Profile
					</Tab.Button>
				</Tab>
				<Tab
					v-if="defaultPermission && permissionsManageUserRole.update"
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
			<Tab.Panel v-if="permissionsUser.update && record">
				<div class="grid grid-cols-12 gap-6">
					<!-- BEGIN: Update User -->
					<div class="col-span-12 intro-y box lg:col-span-6">
						<div
							class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
						>
							<h2 class="mr-auto text-base font-medium">Update User</h2>
						</div>
						<div class="p-5">
							<UpdateForm
								:user="record"
								:is-loading="isLoading"
								:form-loading="formLoading"
								:form-reset="formReset"
								@submit-form="onSubmitForm"
							/>
						</div>
					</div>
					<!-- END: Update User -->
				</div>
			</Tab.Panel>
			<!-- Begin: Roles & Permissions -->
			<Tab.Panel
				v-if="defaultPermission && permissionsManageUserRole.update && record"
			>
				<AssignRole
					:permissions="permissionsManageUserRole"
					:user="record"
					:is-loading="isLoading"
					:form-loading="formLoading"
					:form-reset="formReset"
					@submit-form="onSubmitRole"
					@delete-form="onDeleteRole"
				/>
			</Tab.Panel>
		</Tab.Panels>
	</Tab.Group>
</template>

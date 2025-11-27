<script setup lang="ts">
import { ref } from "vue"
import { AuthStore, ProfileStore } from "@/stores"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import router from "@/router"

// Component
import { Tab } from "@/components/Base/Headless"
import Button from "@/components/Base/Button"
import Lucide from "@/components/Base/Lucide"
import UpdateForm from "./partials/UpdateForm.vue"
import UpdatePicture from "./partials/UpdatePicture.vue"
import ChangePasswordForm from "./partials/ChangePasswordForm.vue"

const authStore = AuthStore.useStore()
const profileStore = ProfileStore.useStore()

const isLoading = ref<boolean>(false)
const formLoading = ref<boolean>(false)
const formReset = ref<boolean>(false)
const selectedTab = ref(0)

const onSubmitPicture = (picture: string) => {
	formLoading.value = true
	profileStore
		.updatePicture({
			picture,
		})
		.then(() => responseDefaultSuccess("updated"))
		.catch((error) => {
			responseDefaultError(error)
			onResetForm()
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onSubmitForm = (updateProfile: {
	first_name: string
	last_name: string
}) => {
	formLoading.value = true
	profileStore
		.updateProfile(updateProfile)
		.then(() => responseDefaultSuccess("updated"))
		.catch((error) => {
			responseDefaultError(error)
			onResetForm()
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onSubmitPasswordForm = (updatePassword: {
	password: string
	new_password: string
	confirm_new_password: string
}) => {
	formLoading.value = true
	profileStore
		.updatePassword(updatePassword)
		.then(() => responseDefaultSuccess("updated"))
		.catch((error) => {
			responseDefaultError(error)
			onResetForm()
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onResetForm = () => {
	formReset.value = !formReset.value
}
</script>

<template>
	<div
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Profile</h2>
	</div>
	<Tab.Group vertical @change="(index) => (selectedTab = index)">
		<div class="grid grid-cols-12 gap-6 mt-5">
			<!-- BEGIN: Profile Menu -->
			<div
				class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block"
			>
				<div class="intro-y box">
					<div class="relative flex items-center p-5">
						<div class="w-12 h-12 image-fit">
							<img
								:alt="authStore.getUserName"
								class="rounded-full"
								:src="authStore.getUserAvatar"
							/>
						</div>
						<div class="ml-4 mr-auto">
							<div class="text-base font-medium">
								{{ authStore.getUserName }}
							</div>
							<div class="text-slate-500">{{ authStore.getUserEmail }}</div>
						</div>
					</div>
					<div
						class="py-3 px-5 border-t border-slate-200/60 dark:border-darkmode-400"
					>
						Settings
					</div>
					<div
						class="p-5 border-t border-slate-200/60 dark:border-darkmode-400"
					>
						<Tab.List class="flex flex-col gap-5 border-0">
							<Tab>
								<a
									:class="[
										'flex items-center cursor-pointer',
										{
											'font-medium text-primary': selectedTab === 0,
										},
									]"
								>
									<Lucide icon="Activity" class="w-4 h-4 mr-2" /> Personal
									Information
								</a>
							</Tab>
							<Tab>
								<a
									:class="[
										'flex items-center cursor-pointer',
										{
											'font-medium text-primary': selectedTab === 1,
										},
									]"
								>
									<Lucide icon="Lock" class="w-4 h-4 mr-2" /> Change Password
								</a>
							</Tab>
						</Tab.List>
					</div>
					<div
						class="flex py-3 px-5 border-t border-slate-200/60 dark:border-darkmode-400"
					>
						<Button
							variant="primary"
							type="button"
							class="ml-auto"
							@click="() => router.push({ name: 'logout' })"
						>
							<lucide icon="LogOut" class="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</div>
			</div>
			<!-- END: Profile Menu -->
			<div class="col-span-12 lg:col-span-8 2xl:col-span-9">
				<Tab.Panels>
					<Tab.Panel>
						<!-- BEGIN: Update Profile -->
						<div class="col-span-12 intro-y box lg:col-span-6">
							<div
								class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
							>
								<h2 class="mr-auto text-base font-medium">
									Display Information
								</h2>
							</div>
							<div class="p-5">
								<div class="flex flex-col md:flex-row">
									<div class="mx-auto md:mt-0 sm:w-60 w-full">
										<!-- BEGIN: Profile Photo -->
										<UpdatePicture
											:picture="authStore.getUserAvatar"
											:name="authStore.getUserName"
											:is-loading="isLoading"
											:form-loading="formLoading"
											:form-reset="formReset"
											@submit-form="onSubmitPicture"
										/>
										<!-- END: Profile Photo -->
									</div>
									<div
										class="flex-1 mx-auto mt-6 md:mr-0 md:mt-0 md:ml-6 w-full"
									>
										<UpdateForm
											:user="authStore.getUser"
											:is-loading="isLoading"
											:form-loading="formLoading"
											:form-reset="formReset"
											@submit-form="onSubmitForm"
										/>
									</div>
								</div>
							</div>
						</div>
						<!-- END: Update Profile -->
					</Tab.Panel>
					<Tab.Panel>
						<!-- BEGIN: Change Password -->
						<div class="col-span-12 intro-y box lg:col-span-6">
							<div
								class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400"
							>
								<h2 class="mr-auto text-base font-medium">Change Password</h2>
							</div>
							<div class="p-5">
								<ChangePasswordForm
									:user="authStore.getUser"
									:is-loading="isLoading"
									:form-loading="formLoading"
									:form-reset="formReset"
									@submit-form="onSubmitPasswordForm"
								/>
							</div>
						</div>
						<!-- END: Change Password -->
					</Tab.Panel>
				</Tab.Panels>
			</div>
		</div>
	</Tab.Group>
</template>

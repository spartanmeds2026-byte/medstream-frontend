<script setup lang="ts">
import { computed, ref } from "vue"
import Lucide from "@/components/Base/Lucide"
import { defaultAccountMenu } from "@/defaultConfig"
import Breadcrumb from "@/components/Base/Breadcrumb"
import { FormInput } from "@/components/Base/Form"
import { Menu, Popover } from "@/components/Base/Headless"
import fakerData from "@/utils/faker"
import _ from "lodash"
import { TransitionRoot } from "@headlessui/vue"
import { type Menu as MenuItem } from "@/stores/menu"
import TopBarNotification from "@/components/_S9/TopBarNotification.vue"

export interface FormattedMenu extends MenuItem {
	active?: boolean
	activeDropdown?: boolean
	subMenu?: FormattedMenu[]
}

import { AuthStore } from "@/stores"
const authStore = AuthStore.useStore()

const searchDropdown = ref(false)
const showSearchDropdown = () => {
	searchDropdown.value = true
}
const hideSearchDropdown = () => {
	searchDropdown.value = false
}

import { useRouter } from "vue-router"
const router = useRouter()
const currentBreadcrumb = computed(() => {
	const routeName = router.currentRoute.value?.name
	return typeof routeName === "string" ? routeName.replace(/-/g, " ") : ""
})
const goTo = (event: MouseEvent, item: FormattedMenu) => {
	event.preventDefault()
	if (item.subMenu) {
		item.activeDropdown = !item.activeDropdown
	} else {
		if (item.pageName !== undefined) {
			router.push({
				name: item.pageName,
			})
		}
	}
}
</script>

<template>
	<!-- BEGIN: Top Bar -->
	<div
		class="relative z-[51] flex h-[67px] items-center border-b border-slate-200"
	>
		<!-- BEGIN: Breadcrumb -->
		<Breadcrumb class="hidden mr-auto -intro-x sm:flex">
			<Breadcrumb.Link to="/" class="text-base leading-4">
				{{ "Portal" }}
			</Breadcrumb.Link>
			<Breadcrumb.Link
				to="/"
				:active="true"
				class="capitalize leading-4 hidden md:block"
			>
				{{ currentBreadcrumb }}
			</Breadcrumb.Link>
		</Breadcrumb>
		<!-- END: Breadcrumb -->
		<!-- BEGIN: Search -->
		<div v-if="false" class="relative mr-3 intro-x sm:mr-6">
			<div class="relative hidden sm:block">
				<FormInput
					type="text"
					class="border-transparent w-56 shadow-none rounded-full bg-slate-300/50 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
					placeholder="Search..."
					@focus="showSearchDropdown"
					@blur="hideSearchDropdown"
				/>
				<Lucide
					icon="Search"
					class="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
				/>
			</div>
			<a class="relative text-slate-600 sm:hidden" href="">
				<Lucide icon="Search" class="w-5 h-5 dark:text-slate-500" />
			</a>
			<TransitionRoot
				as="template"
				:show="searchDropdown"
				enter="transition-all ease-linear duration-150"
				enter-from="mt-5 invisible opacity-0 translate-y-1"
				enter-to="mt-[3px] visible opacity-100 translate-y-0"
				entered="mt-[3px]"
				leave="transition-all ease-linear duration-150"
				leave-from="mt-[3px] visible opacity-100 translate-y-0"
				leave-to="mt-5 invisible opacity-0 translate-y-1"
			>
				<div class="absolute right-0 z-10 mt-[3px]">
					<div class="w-[450px] p-5 box">
						<div class="mb-2 font-medium">Pages</div>
						<div class="mb-5">
							<a href="" class="flex items-center">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 dark:bg-success/10 text-success"
								>
									<Lucide icon="Inbox" class="w-4 h-4" />
								</div>
								<div class="ml-3">Mail Settings</div>
							</a>
							<a href="" class="flex items-center mt-2">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full bg-pending/10 text-pending"
								>
									<Lucide icon="Users" class="w-4 h-4" />
								</div>
								<div class="ml-3">Users & Permissions</div>
							</a>
							<a href="" class="flex items-center mt-2">
								<div
									class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary/80"
								>
									<Lucide icon="CreditCard" class="w-4 h-4" />
								</div>
								<div class="ml-3">Transactions Report</div>
							</a>
						</div>
						<div class="mb-2 font-medium">Users</div>
						<div class="mb-5">
							<a
								v-for="(faker, fakerKey) in _.take(fakerData, 4)"
								:key="fakerKey"
								href=""
								class="flex items-center mt-2"
							>
								<div class="w-8 h-8 image-fit">
									<img
										alt="Medstream Global Portal Tailwind HTML Admin Template"
										class="rounded-full"
										:src="faker.photos[0]"
									/>
								</div>
								<div class="ml-3">{{ faker.users[0].name }}</div>
								<div
									class="w-48 ml-auto text-xs text-right truncate text-slate-500"
								>
									{{ faker.users[0].email }}
								</div>
							</a>
						</div>
						<div class="mb-2 font-medium">Products</div>
						<a
							v-for="(faker, fakerKey) in _.take(fakerData, 4)"
							:key="fakerKey"
							href=""
							class="flex items-center mt-2"
						>
							<div class="w-8 h-8 image-fit">
								<img
									alt="Medstream Global Portal Tailwind HTML Admin Template"
									class="rounded-full"
									:src="faker.images[0]"
								/>
							</div>
							<div class="ml-3">{{ faker.products[0].name }}</div>
							<div
								class="w-48 ml-auto text-xs text-right truncate text-slate-500"
							>
								{{ faker.products[0].category }}
							</div>
						</a>
					</div>
				</div>
			</TransitionRoot>
		</div>
		<!-- END: Search  -->
		<!-- BEGIN: Notifications -->
		<Popover class="mr-auto intro-x sm:mr-6">
			<Popover.Button
				class="relative text-slate-600 outline-none block before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger"
			>
				<Lucide icon="Bell" class="w-5 h-5 dark:text-slate-500" />
			</Popover.Button>
			<Popover.Panel class="w-[280px] sm:w-[350px] p-5 mt-2">
				<TopBarNotification />
			</Popover.Panel>
		</Popover>
		<!-- END: Notifications  -->
		<!-- BEGIN: Account Menu -->
		<Menu>
			<Menu.Button
				class="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x"
			>
				<img :alt="authStore.getUserName" :src="authStore.getUserAvatar" />
			</Menu.Button>
			<Menu.Items class="w-56 mt-px text-white bg-primary">
				<Menu.Header class="font-normal">
					<div class="font-medium">
						{{ authStore.getUserName }}
					</div>
					<div
						class="text-xs text-white/70 mt-0.5 dark:text-slate-500 capitalize"
					>
						{{ authStore.getUserRole }}
					</div>
				</Menu.Header>
				<Menu.Divider class="bg-white/[0.08]" />
				<template v-for="item in defaultAccountMenu">
					<Menu.Item
						v-if="typeof item !== 'string'"
						:key="item.pageName"
						class="hover:bg-white/5"
						@click="goTo($event, item)"
					>
						<Lucide :icon="item.icon" class="w-4 h-4 mr-2" /> {{ item.title }}
					</Menu.Item>
					<Menu.Divider
						v-else-if="item === 'divider'"
						:key="item"
						class="bg-white/[0.08]"
					/>
				</template>
			</Menu.Items>
		</Menu>
		<!-- END: Account Menu -->
	</div>
	<!-- END: Top Bar -->
</template>

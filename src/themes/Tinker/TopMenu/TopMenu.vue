<script setup lang="ts">
import _ from "lodash"
import { ThemeStore } from "@/stores"
import fakerData from "@/utils/faker"
import { useMenuStore } from "@/stores/menu"
import "@/assets/css/themes/tinker/top-nav.css"
import { useRoute, useRouter } from "vue-router"
import { defaultAccountMenu } from "@/defaultConfig"
import {
	type ProvideForceActiveMenu,
	forceActiveMenu,
	type Route,
	type FormattedMenu,
	nestedMenu,
	linkTo,
} from "./top-menu"
import { TransitionRoot } from "@headlessui/vue"
import { type Menu as MenuItem } from "@/stores/menu"
import { watch, reactive, computed, onMounted, ref, provide } from "vue"

// Components
import Lucide from "@/components/Base/Lucide"
import MobileMenu from "@/components/MobileMenu"
import { FormInput } from "@/components/Base/Form"
import Breadcrumb from "@/components/Base/Breadcrumb"
import { Menu, Popover } from "@/components/Base/Headless"
import SimulateLogin from "@/components/_S9/SimulateLogin.vue"
import TopBarNotification from "@/components/_S9/TopBarNotification.vue"

const defaultCompany = computed(() => ThemeStore.useStore().getCompanyDetail)

import { AuthStore } from "@/stores"
import { hasMenuPermissions } from "@/utils/_S9/permissions"
const authStore = AuthStore.useStore()

const searchDropdown = ref(false)
const showSearchDropdown = () => {
	searchDropdown.value = true
}
const hideSearchDropdown = () => {
	searchDropdown.value = false
}
const route: Route = useRoute()
const router = useRouter()
const formattedMenu = reactive<Array<FormattedMenu | "divider">>([])
const setFormattedMenu = (
	computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
	Object.assign(formattedMenu, computedFormattedMenu)
}
const menuStore = useMenuStore()
const menu = computed(() =>
	nestedMenu(
		menuStore.menu("top-menu") as Array<MenuItem | "divider">,
		route
	).filter((item) => hasMenuPermissions(item))
)

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
	forceActiveMenu(route, pageName)
	setFormattedMenu(menu.value)
})

watch(menu, () => {
	setFormattedMenu(menu.value)
})

watch(
	computed(() => route.path),
	() => {
		delete route.forceActiveMenu
	}
)

const currentBreadcrumb = computed(() => {
	const routeName = router.currentRoute.value?.name
	return typeof routeName === "string" ? routeName.replace(/-/g, " ") : ""
})

const hasSubMenuItem = (item: FormattedMenu) => {
	return item.subMenu
		? "#"
		: ((pageName: string | undefined) => {
				try {
					return router.resolve({
						name: pageName,
					}).fullPath
				} catch (err) {
					return ""
				}
			})(item.pageName)
}

const goTo = (event: MouseEvent, item: FormattedMenu) => {
	event.preventDefault()
	linkTo(item, router)
}

onMounted(() => {
	setFormattedMenu(menu.value)
})
</script>

<template>
	<div
		:class="[
			'tinker md:bg-black/[0.15] dark:bg-transparent relative py-5 px-5 md:py-0 sm:px-8 md:px-0',
			'after:content-[\'\'] after:bg-gradient-to-b after:from-theme-1 after:to-theme-2 dark:after:from-darkmode-800 dark:after:to-darkmode-800 after:fixed after:inset-0 after:z-[-2]',
		]"
	>
		<MobileMenu />
		<!-- BEGIN: Top Bar -->
		<div
			class="h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:mx-0 px-4 sm:px-8 md:px-6 mb-10 md:mb-8"
		>
			<div class="flex items-center h-full">
				<!-- BEGIN: Logo -->
				<RouterLink
					:to="{ name: 'dashboard' }"
					class="hidden -intro-x md:flex text-white"
				>
					<defaultCompany.img
						:title="defaultCompany.alt"
						class="w-full max-h-12 mx-auto"
					/>
				</RouterLink>
				<!-- END: Logo -->
				<!-- BEGIN: Breadcrumb -->
				<Breadcrumb
					light
					class="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x"
				>
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
					<div class="hidden sm:block">
						<FormInput
							type="text"
							class="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400/70"
							placeholder="Search..."
							@focus="showSearchDropdown"
							@blur="hideSearchDropdown"
						/>
						<Lucide
							icon="Search"
							class="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
						/>
					</div>
					<a class="relative text-white/70 sm:hidden" href="">
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
				<!-- END: Search -->
				<!-- BEGIN: Notifications -->
				<Popover class="mr-4 intro-x sm:mr-6">
					<Popover.Button
						class="relative text-white/70 outline-none block before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger"
					>
						<Lucide icon="Bell" class="w-5 h-5 dark:text-slate-500" />
					</Popover.Button>
					<Popover.Panel class="w-[280px] sm:w-[350px] p-5 mt-2">
						<TopBarNotification />
					</Popover.Panel>
				</Popover>
				<!-- END: Notifications -->
				<!-- BEGIN: Account Menu -->
				<Menu>
					<Menu.Button
						class="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x"
					>
						<img :alt="authStore.getUserName" :src="authStore.getUserAvatar" />
					</Menu.Button>
					<Menu.Items
						class="w-56 mt-px relative bg-primary/70 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
					>
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
								<Lucide :icon="item.icon" class="w-4 h-4 mr-2" />
								{{ item.title }}
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
		</div>
		<!-- END: Top Bar -->
		<!-- BEGIN: Top Menu -->
		<nav
			class="top-nav relative z-50 -mt-[3px] hidden translate-y-[50px] opacity-0 md:block"
		>
			<ul class="flex flex-wrap h-[58px] px-6 xl:px-[50px]">
				<li v-for="(menuItem, menuKey) in formattedMenu" :key="menuKey">
					<template v-if="menuItem != 'divider'">
						<a
							:href="hasSubMenuItem(menuItem)"
							:class="[
								menuItem.active ? 'top-menu top-menu--active' : 'top-menu',
							]"
							@click="goTo($event, menuItem)"
						>
							<div class="top-menu__icon">
								<Lucide :icon="menuItem.icon" />
							</div>
							<div class="top-menu__title">
								{{ menuItem.title }}
								<Lucide
									v-if="menuItem.subMenu"
									class="top-menu__sub-icon"
									icon="ChevronDown"
								/>
							</div>
						</a>
						<ul
							v-if="menuItem.subMenu"
							:class="{ 'side-menu__sub-open': menuItem.activeDropdown }"
						>
							<li
								v-for="(subMenu, subMenuKey) in menuItem.subMenu"
								:key="subMenuKey"
							>
								<a
									:href="hasSubMenuItem(subMenu)"
									class="top-menu"
									@click="goTo($event, subMenu)"
								>
									<div class="top-menu__icon">
										<Lucide :icon="subMenu.icon" />
									</div>
									<div class="top-menu__title">
										{{ subMenu.title }}
										<Lucide
											v-if="subMenu.subMenu"
											class="top-menu__sub-icon"
											icon="ChevronDown"
										/>
									</div>
								</a>
								<ul
									v-if="subMenu.subMenu"
									:class="{ 'side-menu__sub-open': subMenu.activeDropdown }"
								>
									<li
										v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
										:key="lastSubMenuKey"
									>
										<a
											:href="hasSubMenuItem(lastSubMenu)"
											class="top-menu"
											@click="goTo($event, lastSubMenu)"
										>
											<div class="top-menu__icon">
												<Lucide :icon="lastSubMenu.icon" />
											</div>
											<div class="top-menu__title">
												{{ lastSubMenu.title }}
											</div>
										</a>
									</li>
								</ul>
							</li>
						</ul>
					</template>
				</li>
			</ul>
		</nav>
		<!-- END: Top Menu -->
		<!-- BEGIN: Content -->
		<div
			:class="[
				'rounded-[30px] md:rounded-[35px_35px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative mt-8 dark:bg-darkmode-700',
				'before:content-[\'\'] before:w-full before:h-px before:block',
				'after:content-[\'\'] after:z-[-1] after:rounded-[40px_40px_0px_0px] after:w-[97%] after:inset-y-0 after:absolute after:left-0 after:right-0 after:bg-white/10 after:-mt-4 after:mx-auto after:dark:bg-darkmode-400/50',
			]"
		>
			<SimulateLogin />
			<RouterView />
		</div>
		<!-- END: Content -->
	</div>
</template>

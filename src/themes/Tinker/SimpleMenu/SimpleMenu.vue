<script setup lang="ts">
import "@/assets/css/themes/rubick/side-nav.css"
import { useRoute, useRouter } from "vue-router"
import { ThemeStore } from "@/stores"
import { useMenuStore } from "@/stores/menu"
import {
	type ProvideForceActiveMenu,
	forceActiveMenu,
	type Route,
	type FormattedMenu,
	nestedMenu,
	linkTo,
	enter,
	leave,
} from "./simple-menu"
import { watch, reactive, computed, onMounted, provide } from "vue"
import { type Menu as MenuItem } from "@/stores/menu"
import { hasMenuPermissions } from "@/utils/_S9/permissions"

// Components
import Tippy from "@/components/Base/Tippy"
import Lucide from "@/components/Base/Lucide"
import MobileMenu from "@/components/MobileMenu"
import TopBar from "@/components/Themes/Rubick/TopBar"
import SimulateLogin from "@/components/_S9/SimulateLogin.vue"

const defaultCompany = computed(() => ThemeStore.useStore().getCompanyDetail)
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
		menuStore.menu("simple-menu") as Array<MenuItem | "divider">,
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
		<div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
			<!-- BEGIN: Simple Menu -->
			<nav
				class="side-nav side-nav--simple hidden md:block md:w-[100px] xl:w-[100px] px-5 pb-16 overflow-x-hidden z-10"
			>
				<RouterLink
					:to="{ name: 'dashboard' }"
					class="flex items-center mt-3 intro-x text-white"
				>
					<defaultCompany.imgSmall
						:title="defaultCompany.alt"
						class="w-full max-h-12 mx-auto"
					/>
				</RouterLink>
				<div class="mt-2.5 mb-6 side-nav__divider" />
				<ul>
					<!-- BEGIN: First Child -->
					<template v-for="(menuItem, menuKey) in formattedMenu">
						<li
							v-if="menuItem == 'divider'"
							:key="'divider-' + menuKey"
							type="li"
							class="my-6 side-nav__divider"
						/>
						<li v-else :key="menuKey">
							<Tippy
								as="a"
								:content="menuItem.title"
								:options="{
									placement: 'right',
								}"
								:href="
									menuItem.subMenu
										? '#'
										: ((pageName: string | undefined) => {
												try {
													return router.resolve({
														name: pageName,
													}).fullPath
												} catch (err) {
													return ''
												}
											})(menuItem.pageName)
								"
								:class="[
									menuItem.active ? 'side-menu side-menu--active' : 'side-menu',
								]"
								@click="
									(event: MouseEvent) => {
										event.preventDefault()
										linkTo(menuItem, router)
										setFormattedMenu([...formattedMenu])
									}
								"
							>
								<div class="side-menu__icon">
									<Lucide :icon="menuItem.icon" />
								</div>
								<div class="side-menu__title">
									{{ menuItem.title }}
									<div
										v-if="menuItem.subMenu"
										:class="[
											'side-menu__sub-icon',
											{ 'transform rotate-180': menuItem.activeDropdown },
										]"
									>
										<Lucide icon="ChevronDown" />
									</div>
								</div>
							</Tippy>
							<Transition @enter="enter" @leave="leave">
								<ul
									v-if="menuItem.subMenu && menuItem.activeDropdown"
									:class="{ 'side-menu__sub-open': menuItem.activeDropdown }"
								>
									<li
										v-for="(subMenu, subMenuKey) in menuItem.subMenu"
										:key="subMenuKey"
									>
										<Tippy
											as="a"
											:content="subMenu.title"
											:options="{
												placement: 'right',
											}"
											:href="
												subMenu.subMenu
													? '#'
													: ((pageName: string | undefined) => {
															try {
																return router.resolve({
																	name: pageName,
																}).fullPath
															} catch (err) {
																return ''
															}
														})(subMenu.pageName)
											"
											:class="[
												subMenu.active
													? 'side-menu side-menu--active'
													: 'side-menu',
											]"
											@click="
												(event: MouseEvent) => {
													event.preventDefault()
													linkTo(subMenu, router)
													setFormattedMenu([...formattedMenu])
												}
											"
										>
											<div class="side-menu__icon">
												<Lucide :icon="subMenu.icon" />
											</div>
											<div class="side-menu__title">
												{{ subMenu.title }}
												<div
													v-if="subMenu.subMenu"
													:class="[
														'side-menu__sub-icon',
														{ 'transform rotate-180': subMenu.activeDropdown },
													]"
												>
													<Lucide icon="ChevronDown" />
												</div>
											</div>
										</Tippy>
										<Transition
											v-if="subMenu.subMenu"
											@enter="enter"
											@leave="leave"
										>
											<ul
												v-if="subMenu.subMenu && subMenu.activeDropdown"
												:class="{
													'side-menu__sub-open': subMenu.activeDropdown,
												}"
											>
												<li
													v-for="(
														lastSubMenu, lastSubMenuKey
													) in subMenu.subMenu"
													:key="lastSubMenuKey"
												>
													<Tippy
														as="a"
														:content="lastSubMenu.title"
														:options="{
															placement: 'right',
														}"
														:href="
															lastSubMenu.subMenu
																? '#'
																: ((pageName: string | undefined) => {
																		try {
																			return router.resolve({
																				name: pageName,
																			}).fullPath
																		} catch (err) {
																			return ''
																		}
																	})(lastSubMenu.pageName)
														"
														:class="[
															lastSubMenu.active
																? 'side-menu side-menu--active'
																: 'side-menu',
														]"
														@click="
															(event: MouseEvent) => {
																event.preventDefault()
																linkTo(lastSubMenu, router)
																setFormattedMenu([...formattedMenu])
															}
														"
													>
														<div class="side-menu__icon">
															<Lucide :icon="lastSubMenu.icon" />
														</div>
														<div class="side-menu__title">
															{{ lastSubMenu.title }}
														</div>
													</Tippy>
												</li>
											</ul>
										</Transition>
									</li>
								</ul>
							</Transition>
						</li>
					</template>
					<!-- END: First Child -->
				</ul>
			</nav>
			<!-- END: Simple Menu -->
			<!-- BEGIN: Content -->
			<div
				:class="[
					'rounded-[30px] md:rounded-[35px/50px_0px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative md:ml-4 dark:bg-darkmode-700',
					'before:content-[\'\'] before:w-full before:h-px before:block',
					'after:content-[\'\'] after:z-[-1] after:rounded-[40px_0px_0px_0px] after:w-full after:inset-y-0 after:absolute after:left-0 after:bg-white/10 after:mt-8 after:-ml-4 after:dark:bg-darkmode-400/50 after:hidden md:after:block',
				]"
			>
				<TopBar />
				<SimulateLogin />
				<RouterView />
			</div>
			<!-- END: Content -->
		</div>
	</div>
</template>

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
} from "./side-menu"
import { watch, reactive, ref, computed, onMounted, provide } from "vue"
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
		menuStore.menu("side-menu") as Array<MenuItem | "divider">,
		route
	).filter((item) => hasMenuPermissions(item))
)
const windowWidth = ref(window.innerWidth)

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

	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
})

const toggleMenu = ref(false)
</script>

<template>
	<div
		:class="[
			'rubick px-5 sm:px-8 py-5',
			'before:content-[\'\'] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 dark:before:from-darkmode-800 dark:before:to-darkmode-800 before:fixed before:inset-0 before:z-[-1]',
		]"
	>
		<MobileMenu />
		<div class="mt-[4.7rem] flex md:mt-0">
			<!-- BEGIN: Side Menu -->
			<nav
				:class="[
					'side-nav hidden overflow-x-hidden pb-16 pr-5 md:block',
					{
						'w-[80px] xl:w-[230px]': !toggleMenu,
						'w-[80px]': toggleMenu,
					},
				]"
			>
				<!-- BEGIN: Logo -->
				<Tippy
					as="a"
					content="Toggle Menu"
					:options="{
						placement: 'bottom',
					}"
					class="flex items-center intro-x text-white w-full mt-2.5"
					@click="() => (toggleMenu = !toggleMenu)"
				>
					<defaultCompany.imgSmall
						:title="defaultCompany.alt"
						:class="[
							'w-auto max-h-12 mx-auto',
							{
								'xl:hidden': !toggleMenu,
							},
						]"
					/>
					<defaultCompany.img
						:title="defaultCompany.alt"
						:class="[
							'w-auto max-h-12 mr-auto',
							{
								'hidden xl:block': !toggleMenu,
								hidden: toggleMenu,
							},
						]"
					/>
				</Tippy>
				<div class="mt-2.5 mb-6 side-nav__divider" />
				<ul>
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
								:disable="windowWidth > 1260 && !toggleMenu"
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
								<div
									:class="[
										'side-menu__title',
										{
											'!hidden': toggleMenu,
										},
									]"
								>
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
											:disable="windowWidth > 1260 && !toggleMenu"
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
											<div
												:class="[
													'side-menu__title',
													{
														'!hidden': toggleMenu,
													},
												]"
											>
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
														:disable="windowWidth > 1260 && !toggleMenu"
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
														<div
															:class="[
																'side-menu__title',
																{
																	'!hidden': toggleMenu,
																},
															]"
														>
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
				</ul>
			</nav>
			<!-- END: Side Menu -->
			<!-- BEGIN: Content -->
			<div
				class="md:max-w-auto min-h-screen min-w-0 max-w-full flex-1 rounded-[30px] bg-slate-100 px-4 pb-10 before:block before:h-px before:w-full before:content-[''] dark:bg-darkmode-700 md:px-[22px]"
			>
				<TopBar />
				<SimulateLogin />
				<RouterView />
			</div>
			<!-- END: Content -->
		</div>
	</div>
</template>

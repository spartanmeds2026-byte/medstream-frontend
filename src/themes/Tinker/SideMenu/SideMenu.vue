<script setup lang="ts">
import { ThemeStore } from "@/stores"
import { useMenuStore } from "@/stores/menu"
import { useRoute, useRouter } from "vue-router"
import "@/assets/css/themes/tinker/side-nav.css"
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
import { type Menu as MenuItem } from "@/stores/menu"
import { hasMenuPermissions } from "@/utils/_S9/permissions"
import { watch, reactive, ref, computed, onMounted, provide } from "vue"

// Components
import Tippy from "@/components/Base/Tippy"
import Lucide from "@/components/Base/Lucide"
import MobileMenu from "@/components/MobileMenu"
import TopBar from "@/components/Themes/Tinker/TopBar"
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
			'tinker md:bg-black/[0.15] dark:bg-transparent relative py-5 px-5 md:py-0 sm:px-8 md:px-0',
			'after:content-[\'\'] after:bg-gradient-to-b after:from-theme-1 after:to-theme-2 dark:after:from-darkmode-800 dark:after:to-darkmode-800 after:fixed after:inset-0 after:z-[-2]',
		]"
	>
		<MobileMenu />
		<div class="flex mt-[4.7rem] md:mt-0 overflow-hidden">
			<!-- BEGIN: Side Menu -->
			<nav
				:class="[
					'side-nav hidden md:block px-5 pb-16 overflow-x-hidden z-10',
					{
						'w-[100px] xl:w-[250px]': !toggleMenu,
						'w-[100px]': toggleMenu,
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

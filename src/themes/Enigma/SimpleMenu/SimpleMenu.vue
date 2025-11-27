<script setup lang="ts">
import "@/assets/css/themes/enigma/side-nav.css"
import { useRoute, useRouter } from "vue-router"
import Tippy from "@/components/Base/Tippy"
import Lucide from "@/components/Base/Lucide"
import TopBar from "@/components/Themes/Enigma/TopBar"
import MobileMenu from "@/components/MobileMenu"
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
import SimulateLogin from "@/components/_S9/SimulateLogin.vue"

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
			'enigma py-5 px-5 md:py-0 sm:px-8 md:px-0',
			'before:content-[\'\'] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 dark:before:from-darkmode-800 dark:before:to-darkmode-800 md:before:bg-none md:bg-slate-200 md:dark:bg-darkmode-800 before:fixed before:inset-0 before:z-[-1]',
		]"
	>
		<MobileMenu />
		<TopBar layout="simple-menu" />
		<div class="flex overflow-hidden">
			<!-- BEGIN: Simple Menu -->
			<nav
				class="side-nav side-nav--simple w-[100px] px-5 pb-16 overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block"
			>
				<ul>
					<!-- BEGIN: First Child -->
					<template v-for="(menuItem, menuKey) in formattedMenu">
						<li
							v-if="menuItem == 'divider'"
							:key="'divider-' + menuKey"
							type="li"
							:class="[
								'side-nav__divider my-6',

								// Animation
								`opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
									(menuKey + 1) * 10
								}`,
							]"
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

									// Animation
									{
										[`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
											(menuKey + 1) * 10
										}`]: !menuItem.active,
									},
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

												// Animation
												{
													[`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
														(subMenuKey + 1) * 10
													}`]: !subMenu.active,
												},
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
														{
															'transform rotate-180': subMenu.activeDropdown,
														},
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

															// Animation
															{
																[`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
																	(lastSubMenuKey + 1) * 10
																}`]: !lastSubMenu.active,
															},
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
					'max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700',
					'before:content-[\'\'] before:w-full before:h-px before:block',
				]"
			>
				<SimulateLogin />
				<RouterView />
			</div>
			<!-- END: Content -->
		</div>
	</div>
</template>

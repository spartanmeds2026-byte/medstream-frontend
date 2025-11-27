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
} from "./side-menu"
import { watch, reactive, ref, computed, onMounted, provide } from "vue"
import { type Menu as MenuItem } from "@/stores/menu"
import { hasMenuPermissions } from "@/utils/_S9/permissions"
import ScrollPanel from "primevue/scrollpanel"
import SimulateLogin from "@/components/_S9/SimulateLogin.vue"
import { AuthStore } from "@/stores"
const authStore = AuthStore.useStore()

const scrollPanelKey = ref(Symbol())
const route: Route = useRoute()
const router = useRouter()
const formattedMenu = reactive<Array<FormattedMenu | "divider">>([])
const formattedBottomMenu = reactive<Array<FormattedMenu | "divider">>([])
const setFormattedMenu = (
	computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
	Object.assign(formattedMenu, computedFormattedMenu)
}

const setFormattedBottomMenu = (
	computedFormattedMenu: Array<FormattedMenu | "divider">
) => {
	Object.assign(formattedBottomMenu, computedFormattedMenu)
}
const menuStore = useMenuStore()
const menu = computed(() =>
	nestedMenu(
		menuStore.menu("side-menu") as Array<MenuItem | "divider">,
		route
	).filter((item) => hasMenuPermissions(item))
)
const bottomMenu = computed(() =>
	nestedMenu(
		menuStore.menuBottom() as Array<MenuItem | "divider">,
		route
	).filter((item) => hasMenuPermissions(item))
)

const windowWidth = ref(window.innerWidth)

provide<ProvideForceActiveMenu>("forceActiveMenu", (pageName: string) => {
	forceActiveMenu(route, pageName)
	setFormattedMenu(menu.value)
	setFormattedBottomMenu(bottomMenu.value)
})

watch(menu, () => {
	setFormattedMenu(menu.value)
	setFormattedBottomMenu(bottomMenu.value)
})

watch(
	computed(() => route.path),
	() => {
		delete route.forceActiveMenu
	}
)

onMounted(() => {
	setFormattedMenu(menu.value)
	setFormattedBottomMenu(bottomMenu.value)

	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
		scrollPanelKey.value = Symbol()
	})
})

const toggleMenu = ref(false)

const formatPhoneNumber = (phone: string): string => {
	const cleaned = phone.replace(/\D/g, "")
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
	}
	return phone
}
</script>

<template>
	<div
		:class="[
			'enigma py-5 px-5 md:py-0 sm:px-8 md:px-0',
			'before:content-[\'\'] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 dark:before:from-darkmode-800 dark:before:to-darkmode-800 md:before:bg-none md:bg-slate-200 md:dark:bg-darkmode-800 before:fixed before:inset-0 before:z-[-1]',
		]"
	>
		<MobileMenu />
		<TopBar
			layout="side-menu"
			@toggle-menu="() => (toggleMenu = !toggleMenu)"
		/>
		<div class="flex overflow-hidden">
			<!-- BEGIN: Side Menu -->
			<nav
				:class="[
					'side-nav fixed pl-4 pr-2 pb-4 z-50 pt-32 -mt-4 hidden md:block',
					{
						'w-[100px] xl:w-[260px]': !toggleMenu,
						'w-[100px]': toggleMenu,
					},
				]"
			>
				<ScrollPanel
					:key="scrollPanelKey"
					:style="{
						height: `calc(100vh - 12rem - ${windowWidth >= 1280 && !toggleMenu && formattedBottomMenu.length > 0 ? 4 : formattedBottomMenu.length * 3.33}rem)`,
						width: '100%',
						overflowX: 'hidden',
					}"
					:pt="{
						content:
							'h-[calc(100%+12px)] w-[calc(100%+12px)] pr-[12px] pb-[12px] pl-0 pt-0 overflow-scroll scrollbar-none box-border relative [&::-webkit-scrollbar]:hidden overflow-x-hidden',
					}"
				>
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
										menuItem.active
											? 'side-menu side-menu--active'
											: 'side-menu',
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
				</ScrollPanel>
			</nav>
			<nav
				:class="[
					'side-nav fixed bottom-0 z-50 hidden md:block bg-slate-300/50 dark:bg-slate-900/40',
					{
						'pl-4 pr-2': toggleMenu || windowWidth < 1280,
					},
					{
						'w-[100px] xl:w-[260px]': !toggleMenu,
						'w-[100px]': toggleMenu,
					},
				]"
			>
				<ul>
					<div
						v-show="
							(windowWidth >= 1280 && !toggleMenu) || authStore.getSalesRep
						"
						:class="[
							{
								'p-2': windowWidth >= 1280 && !toggleMenu,
								'pr-3 py-2 flex flex-col justify-center items-center gap-3 [&_>_*]:box [&_>_*]:shadow-none [&_>_*]:rounded-md [&_>_*]:p-1 ':
									windowWidth < 1280 || toggleMenu,
							},
						]"
					>
						<div v-if="windowWidth >= 1280 && !toggleMenu" class="w-full">
							<h4 class="text-sm font-semibold text-gray-600">
								Your Sales Rep
							</h4>
						</div>

						<div v-if="authStore.getSalesRep?.name" class="w-full">
							<Tippy
								as="div"
								:content="authStore.getSalesRep?.name"
								class="flex items-center gap-2 py-1 !cursor-default"
							>
								<Lucide icon="User" class="text-gray-500" />
								<span
									v-if="windowWidth >= 1280 && !toggleMenu"
									class="font-bold text-gray-800"
								>
									{{ authStore.getSalesRep?.name }}
								</span>
							</Tippy>
						</div>

						<div v-if="authStore.getSalesRep?.email" class="w-full">
							<Tippy
								:content="authStore.getSalesRep?.email"
								as="a"
								class="hover:text-primary flex items-center gap-2 py-1"
								:href="`mailto:${authStore.getSalesRep?.email}`"
							>
								<Lucide icon="Mail" class="text-gray-500" />
								<span
									v-if="windowWidth >= 1280 && !toggleMenu"
									class="line-clamp-1 max-w-52 text-gray-600"
								>
									{{ authStore.getSalesRep?.email }}
								</span>
							</Tippy>
						</div>

						<div v-if="authStore.getSalesRep?.phone" class="w-full">
							<Tippy
								as="a"
								:content="formatPhoneNumber(authStore.getSalesRep?.phone)"
								class="hover:text-primary flex items-center gap-2 py-1"
								:href="`tel:${authStore.getSalesRep?.phone}`"
							>
								<Lucide icon="Phone" class="text-gray-500" />
								<span
									v-if="windowWidth >= 1280 && !toggleMenu"
									class="text-gray-600"
								>
									{{ formatPhoneNumber(authStore.getSalesRep?.phone) }}
								</span>
							</Tippy>
						</div>
					</div>
					<div
						v-if="formattedBottomMenu.length > 0"
						:class="[
							{
								'flex justify-center items-center p-2':
									windowWidth >= 1280 && !toggleMenu,
								'pr-3 py-2': windowWidth < 1280 || toggleMenu,
							},
						]"
					>
						<template v-for="(menuItem, menuKey) in formattedBottomMenu">
							<li
								v-if="menuItem == 'divider'"
								:key="'divider-' + menuKey"
								type="li"
								:class="[
									{
										'mx-3 !h-[50px] !w-[1px] side-nav__divider':
											windowWidth >= 1280,
										'my-6 side-nav__divider': windowWidth < 1280,
									},
								]"
							/>
							<li v-else :key="menuKey">
								<Tippy
									as="a"
									:content="menuItem.title"
									:options="{
										placement: windowWidth >= 1280 ? 'top' : 'right',
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
										{
											'px-5 !mb-0 mr-1 after:hidden':
												windowWidth >= 1280 && !toggleMenu,
										},
										menuItem.active
											? 'side-menu side-menu--active'
											: 'side-menu',
									]"
									@click="
										(event: MouseEvent) => {
											event.preventDefault()
											if (menuItem.fn) menuItem.fn()
											linkTo(menuItem, router)
											setFormattedBottomMenu([...formattedBottomMenu])
										}
									"
								>
									<div class="side-menu__icon">
										<Lucide :icon="menuItem.icon" />
									</div>
								</Tippy>
							</li>
						</template>
					</div>
				</ul>
			</nav>
			<!-- END: Side Menu -->
			<!-- BEGIN: Content -->
			<div
				:class="[
					{
						'md:ml-[100px] xl:ml-[260px]': !toggleMenu,
						'md:ml-[100px]': toggleMenu,
					},
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

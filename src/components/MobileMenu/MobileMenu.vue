<script setup lang="ts">
import "@/assets/css/vendors/simplebar.css"
import "@/assets/css/components/mobile-menu.css"
import { useRoute, useRouter } from "vue-router"
import { twMerge } from "tailwind-merge"
import { useMenuStore } from "@/stores/menu"
import {
	type FormattedMenu,
	nestedMenu,
	linkTo,
	enter,
	leave,
} from "./mobile-menu"
import { watch, reactive, computed, onMounted, ref } from "vue"
import { type Menu as MenuItem } from "@/stores/menu"
import { hasMenuPermissions } from "@/utils/_S9/permissions"

// Components
import SimpleBar from "simplebar"
import Lucide from "@/components/Base/Lucide"
import CompanyLogo from "@/components/_S9/CompanyLogo.vue"

const route = useRoute()
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

const activeMobileMenu = ref(false)
const setActiveMobileMenu = (active: boolean) => {
	activeMobileMenu.value = active
}

const scrollableRef = ref<HTMLDivElement>()

watch(menu, () => {
	setFormattedMenu(menu.value)
})

onMounted(() => {
	if (scrollableRef.value) {
		new SimpleBar(scrollableRef.value)
	}

	setFormattedMenu(menu.value)
})
</script>

<template>
	<!-- BEGIN: Mobile Menu -->
	<div
		:class="[
			'mobile-menu group top-0 inset-x-0 fixed bg-theme-1/90 z-[60] border-b border-white/[0.08] dark:bg-darkmode-800/90 md:hidden',
			'before:content-[\'\'] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out',
			'before:invisible before:opacity-0',
			'[&.mobile-menu--active]:before:visible [&.mobile-menu--active]:before:opacity-100',
			activeMobileMenu && 'mobile-menu--active',
		]"
	>
		<div class="h-[70px] px-3 sm:px-8 flex items-center">
			<a href="" class="flex mr-auto text-white">
				<CompanyLogo class="w-full max-h-12 mx-auto max-w-[190px]" />
			</a>
			<a href="#" @click="(e) => e.preventDefault()">
				<Lucide
					icon="BarChart2"
					class="w-8 h-8 text-white transform -rotate-90"
					@click="
						() => {
							setActiveMobileMenu(!activeMobileMenu)
						}
					"
				/>
			</a>
		</div>
		<div
			ref="scrollableRef"
			:class="
				twMerge([
					'h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800',
					'[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50',
					'group-[.mobile-menu--active]:ml-0',
				])
			"
		>
			<a
				href="#"
				:class="[
					'fixed top-0 right-0 mt-4 mr-4 transition-opacity duration-200 ease-in-out',
					'invisible opacity-0',
					'group-[.mobile-menu--active]:visible group-[.mobile-menu--active]:opacity-100',
				]"
				@click="(e) => e.preventDefault()"
			>
				<Lucide
					icon="XCircle"
					class="w-8 h-8 text-white transform -rotate-90"
					@click="
						() => {
							setActiveMobileMenu(!activeMobileMenu)
						}
					"
				/>
			</a>
			<ul class="py-2">
				<!-- BEGIN: First Child -->
				<template v-for="(menuItem, menuKey) in formattedMenu">
					<li
						v-if="menuItem == 'divider'"
						:key="`divider-${menuKey}`"
						class="my-6 menu__divider"
					/>
					<li v-else :key="menuKey">
						<a
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
							:class="[menuItem.active ? 'menu menu--active' : 'menu']"
							@click="
								(event) => {
									event.preventDefault()
									linkTo(menuItem, router, setActiveMobileMenu)
									setFormattedMenu([...formattedMenu])
								}
							"
						>
							<div class="menu__icon">
								<Lucide :icon="menuItem.icon" />
							</div>
							<div class="menu__title">
								{{ menuItem.title }}
								<div
									v-if="menuItem.subMenu"
									:class="[
										'menu__sub-icon',
										menuItem.activeDropdown && 'transform rotate-180',
									]"
								>
									<Lucide icon="ChevronDown" />
								</div>
							</div>
						</a>
						<Transition @enter="enter" @leave="leave">
							<ul
								v-if="menuItem.subMenu && menuItem.activeDropdown"
								:class="{ 'menu__sub-open': menuItem.activeDropdown }"
							>
								<li
									v-for="(subMenu, subMenuKey) in menuItem.subMenu"
									:key="subMenuKey"
								>
									<a
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
										:class="[subMenu.active ? 'menu menu--active' : 'menu']"
										@click="
											(event) => {
												event.preventDefault()
												linkTo(subMenu, router, setActiveMobileMenu)
												setFormattedMenu([...formattedMenu])
											}
										"
									>
										<div class="menu__icon">
											<Lucide :icon="subMenu.icon" />
										</div>
										<div class="menu__title">
											{{ subMenu.title }}
											<div
												v-if="subMenu.subMenu"
												:class="[
													'menu__sub-icon',
													subMenu.activeDropdown && 'transform rotate-180',
												]"
											>
												<Lucide icon="ChevronDown" />
											</div>
										</div>
									</a>
									<Transition @enter="enter" @leave="leave">
										<ul
											v-if="subMenu.subMenu && subMenu.activeDropdown"
											:class="{ 'menu__sub-open': subMenu.activeDropdown }"
										>
											<li
												v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
												:key="lastSubMenuKey"
											>
												<a
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
														lastSubMenu.active ? 'menu menu--active' : 'menu',
													]"
													@click="
														(event) => {
															event.preventDefault()
															linkTo(lastSubMenu, router, setActiveMobileMenu)
															setFormattedMenu([...formattedMenu])
														}
													"
												>
													<div class="menu__icon">
														<Lucide :icon="lastSubMenu.icon" />
													</div>
													<div class="menu__title">{{ lastSubMenu.title }}</div>
												</a>
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
		</div>
	</div>
	<!-- END: Mobile Menu -->
</template>

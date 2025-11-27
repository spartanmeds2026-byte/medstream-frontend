import { type Icon } from "@/components/Base/Lucide/Lucide.vue"
import { type Themes } from "@/stores/theme"
import { defaultDevMode, defaultS9Router } from "@/defaultConfig"
import { defineStore } from "pinia"
import { defaultHeaderMenu, defaultBottomMenu } from "@/defaultConfig"
import sideMenu from "@/main/side-menu"
import simpleMenu from "@/main/simple-menu"
import topMenu from "@/main/top-menu"

export interface Menu {
	icon: Icon
	title: string
	pageName?: string
	subMenu?: Menu[]
	ignore?: boolean
	force?: boolean
	permission?: string
	fn?: () => void
}

export interface MenuState {
	menuValue: Array<Menu | "divider">
}

export const useMenuStore = defineStore("menu", {
	state: (): MenuState => ({
		menuValue: [],
	}),
	getters: {
		menu: () => (layout: Themes["layout"]) => {
			const itemsRender = []
			if (defaultS9Router === true) {
				itemsRender.push(...defaultHeaderMenu)
			}

			if (defaultDevMode) {
				itemsRender.push(
					{
						icon: "FileIcon",
						pageName: "blank",
						title: "Blank",
					},
					{
						icon: "HardDriveIcon",
						pageName: "formio",
						title: "Form Demo",
					},
					{
						icon: "HardDriveIcon",
						pageName: "formio-builder",
						title: "Form Builder Demo",
					}
				)
				if (layout == "top-menu") {
					itemsRender.push(
						...topMenu.map((item) => {
							if (typeof item == "string") {
								return item
							} else {
								return {
									...item,
									force: true,
								}
							}
						})
					)
				} else if (layout == "simple-menu") {
					itemsRender.push(
						...simpleMenu.map((item) => {
							if (typeof item == "string") {
								return item
							} else {
								return {
									...item,
									force: true,
								}
							}
						})
					)
				} else {
					itemsRender.push(
						...sideMenu.map((item) => {
							if (typeof item == "string") {
								return item
							} else {
								return {
									...item,
									force: true,
								}
							}
						})
					)
				}
			}
			return itemsRender
		},
		menuBottom: () => () => defaultBottomMenu,
	},
})

import { defineStore } from "pinia"
import { defaultColorScheme } from "@/defaultConfig"

export const colorSchemes = ["default", "theme-1"] as const

export type ColorSchemes = (typeof colorSchemes)[number]

interface ColorSchemeState {
	colorSchemeValue: ColorSchemes
}

const getColorScheme = () => {
	const colorScheme = localStorage.getItem("colorScheme")
	return colorSchemes.filter((item) => {
		return item === colorScheme
	})[0]
}

export const useColorSchemeStore = defineStore("colorScheme", {
	state: (): ColorSchemeState => ({
		colorSchemeValue:
			localStorage.getItem("colorScheme") === null
				? defaultColorScheme
				: getColorScheme(),
	}),
	getters: {
		colorScheme(state) {
			if (localStorage.getItem("colorScheme") === null) {
				localStorage.setItem("colorScheme", defaultColorScheme)
			}

			return state.colorSchemeValue
		},
	},
	actions: {
		setColorScheme(colorScheme: ColorSchemes) {
			localStorage.setItem("colorScheme", colorScheme)
			this.colorSchemeValue = colorScheme
		},
	},
})

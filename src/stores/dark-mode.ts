import { defineStore } from "pinia"
import { defaultDarkMode } from "@/defaultConfig"

interface DarkModeState {
	darkModeValue: boolean
}

export const useDarkModeStore = defineStore("darkMode", {
	state: (): DarkModeState => ({
		darkModeValue:
			localStorage.getItem("darkMode") === null
				? defaultDarkMode
				: localStorage.getItem("darkMode") === "true",
	}),
	getters: {
		darkMode(state) {
			if (localStorage.getItem("darkMode") === null) {
				localStorage.setItem("darkMode", defaultDarkMode.toString())
			}

			return state.darkModeValue
		},
	},
	actions: {
		setDarkMode(darkMode: boolean) {
			localStorage.setItem("darkMode", darkMode.toString())
			this.darkModeValue = darkMode
		},
	},
})

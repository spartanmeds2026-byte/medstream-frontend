import { markRaw } from "vue"

import { defineStore } from "pinia"
import { useColorSchemeStore } from "@/stores/color-scheme"

import logoUrlMedstream from "@/assets/images/logo-medstream.svg"
import logoSmallUrlMedstream from "@/assets/images/logo-small-medstream.svg"
import bannerLoginMedstream from "@/assets/images/banner-login-medstream.webp"

import logoSpartanSupply from "@/assets/images/logo-spartan-supply.svg"
import logoUrlSpartan from "@/assets/images/logo-spartan.svg"
import logoSmallUrlSpartan from "@/assets/images/logo-small-spartan.svg"
import bannerLoginSpartan from "@/assets/images/banner-login-spartan.webp"

interface S9themeState {
	key: string
	Company: {
		img: string | any
		imgSmall: string
		alt: string
		title: string
		bannerLogin: string
		url: string
	}
	Avatar: {
		color: string
		background: string
		"font-size": string
		bold: string
		size: string
	}
	breadcrumb: {
		router: string
		titles: string[]
	}
}

const companies = {
	medstream: {
		detail: {
			img: [logoUrlMedstream],
			imgSmall: logoSmallUrlMedstream,
			alt: "Medstream Global Portal",
			title: "Medstream Global Portal",
			bannerLogin: bannerLoginMedstream,
			url: import.meta.env.VITE_PROJECT_FRONT_URL_MEDSTREAM,
		},
		avatar: {
			color: "ffffff",
			background: "426de8",
			"font-size": "0.5",
			bold: "true",
			size: "200",
		},
	},
	spartan: {
		detail: {
			img: [logoSpartanSupply, logoUrlSpartan],
			imgSmall: logoSmallUrlSpartan,
			alt: "Spartan Medical Portal",
			title: "Spartan Medical Portal",
			bannerLogin: bannerLoginSpartan,
			url: import.meta.env.VITE_PROJECT_FRONT_URL_SPARTAN,
		},
		avatar: {
			color: "ffffff",
			background: "426de8",
			"font-size": "0.5",
			bold: "true",
			size: "200",
		},
	},
}

export const useStore = defineStore("S9theme", {
	state: (): S9themeState => ({
		key: "",
		Company: {
			img: "",
			imgSmall: "",
			alt: "Portal",
			title: "Portal",
			bannerLogin: "",
			url: "",
		},
		Avatar: {
			color: "ffffff",
			background: "426de8",
			"font-size": "0.5",
			bold: "true",
			size: "200",
		},
		breadcrumb: {
			router: "",
			titles: [],
		},
	}),
	getters: {
		getCompany: (state) => state.key,
		getCompanyDetail: (state) => state.Company,
		getAvatar: (state) => state.Avatar,
		getBreadcrumb: (state) => state.breadcrumb,
	},
	actions: {
		setCompany(key: string) {
			this.key = key
			this.setThemeSettings(key)
		},
		setThemeSettings(themeSettings: string) {
			const colorScheme = useColorSchemeStore()

			if (themeSettings === "medstream") {
				colorScheme.setColorScheme("default")
				this.Company = markRaw(companies[themeSettings].detail)
				this.Avatar = markRaw(companies[themeSettings].avatar)
			}

			if (themeSettings === "spartan") {
				colorScheme.setColorScheme("theme-1")
				this.Company = markRaw(companies[themeSettings].detail)
				this.Avatar = markRaw(companies[themeSettings].avatar)
			}
		},
		setBreadcrumb(breadcrumb: { router: string; titles: string[] }) {
			this.breadcrumb.router = breadcrumb.router
			this.breadcrumb.titles = breadcrumb.titles
		},
	},
	persist: {
		storage: localStorage,
	},
})

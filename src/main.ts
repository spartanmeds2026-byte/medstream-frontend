// import { defaultDevMode } from "@/defaultConfig"
import { createApp } from "vue"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import "primeicons/primeicons.css"
import wind from "./assets/css/presets/Wind"

import PrimeVue from "primevue/config"

import App from "./App.vue"
import router from "./router"
import "./assets/css/app.css"

// Primevue
import ConfirmationService from "primevue/confirmationservice"

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(ConfirmationService)
app.use(router)
app.use(PrimeVue, {
	ripple: true,
	unstyled: true,
	pt: wind,
})

app.mount("#app")

console.log(
	`%cDeveloped by %c${import.meta.env.VITE_DEVELOPER_BY}`,
	"font-size: 25px; font-weight: bold; color: white;",
	"font-size: 30px; font-weight: bold; color: #1678b6;"
)

console.log(
	"%cVisit https://www.infraxio.com for more information.",
	"font-size: 20px;"
)

// if (!defaultDevMode)
// 	console.log =
// 		console.debug =
// 		console.warn =
// 		console.info =
// 		console.trace =
// 		console.error =
// 			() => {}

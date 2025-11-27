import creditApps from "./web/creditApps"
import purchaseHistorys from "./purchaseHistorys"
import categories from "./categories"
import orders from "./orders"
import products from "./products"
import { createRouter, createWebHistory } from "vue-router"
import { defaultDevMode } from "@/defaultConfig"
import { AuthStore } from "@/stores"
import templates from "./templates"
import auth from "./auth"
import profile from "./profile"
import users from "./users"

// Components
import Layout from "@/themes"

const routes = [
	{
		path: "/",
		component: Layout,
		meta: { requiresAuth: true },
		children: [
			{
				path: "",
				name: "dashboard",
				component: () => import("../pages/Dashboard/Dashboard.vue"),
			},
			...profile,
			...users,
			...products,
			...orders,
			...categories,
			...purchaseHistorys,
		],
	},
	...auth,
	...creditApps,
	{
		path: "/:pathMatch(.*)*",
		name: "404",
		component: () => import("../pages/404.vue"),
	},
]

if (defaultDevMode) {
	routes.push(...templates)
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
	scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to, from, next) => {
	try {
		const authStore = AuthStore.useStore()

		if (to.meta.requiresAuth) {
			const isAuthenticated = authStore.getIsAuthenticated

			if (!isAuthenticated) {
				const isValidSession = await authStore.authCheck()
				if (!isValidSession) {
					return next({ name: "login" })
				}
			}
		}

		if (to.name === "login" && authStore.getIsAuthenticated) {
			return next({ name: "dashboard" })
		}

		next()
	} catch (error) {
		next({ name: "login" })
	}
})

export default router

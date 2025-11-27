export default [
	{
		path: "/login",
		name: "login",
		component: () => import("../pages/Auth/Login/Login.vue"),
	},
	{
		path: "/auth",
		children: [
			{
				path: "stytch/callback",
				name: "auth-stytch-callback",
				component: () =>
					import("../pages/Auth/Login/Stytch/StytchCallback.vue"),
			},
		],
	},
	{
		path: "/logout",
		name: "logout",
		component: () => import("../pages/Auth/LogOut.vue"),
	},
]

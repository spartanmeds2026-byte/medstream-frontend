export default [
	{
		path: "/credit",
		children: [
			{
				path: "",
				name: "credit-apps",
				component: () => import("@/pages/Web/CreditApps/Create.vue"),
			},
		],
	},
]

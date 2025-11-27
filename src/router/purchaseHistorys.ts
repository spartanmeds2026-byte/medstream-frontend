export default [
	{
		path: "/purchase-history",
		children: [
			{
				path: "",
				name: "purchase-history",
				component: () => import("../pages/PurchaseHistorys/List.vue"),
			},
		],
	},
]

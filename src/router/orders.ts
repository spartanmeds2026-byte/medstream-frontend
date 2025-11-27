export default [
	{
		path: "/orders",
		children: [
			{
				path: "",
				name: "orders",
				component: () => import("../pages/Orders/List.vue"),
			},
			{
				path: ":orderId",
				name: "order",
				component: () => import("../pages/Orders/Show.vue"),
			},
			{
				path: ":orderId/edit",
				name: "order-edit",
				component: () => import("../pages/Orders/Edit.vue"),
			},
			{
				path: "create",
				name: "order-create",
				component: () => import("../pages/Orders/Create.vue"),
			},
		],
	},
]

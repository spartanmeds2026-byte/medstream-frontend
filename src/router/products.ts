export default [
	{
		path: "/products",
		children: [
			{
				path: "",
				name: "products",
				component: () => import("../pages/Products/List.vue"),
			},
			{
				path: ":productId",
				name: "product",
				component: () => import("../pages/Products/Show.vue"),
			},
		],
	},
]

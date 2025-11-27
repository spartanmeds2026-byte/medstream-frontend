export default [
	{
		path: "/categories",
		children: [
			{
				path: "",
				name: "categories",
				component: () => import("../pages/Categories/List.vue"),
			},
		],
	},
]

export default [
	{
		path: "/users",
		children: [
			{
				path: "",
				name: "users",
				component: () => import("../pages/Users/List.vue"),
			},
			{
				path: ":userId",
				name: "user",
				component: () => import("../pages/Users/Show.vue"),
			},
			{
				path: ":userId/edit",
				name: "user-edit",
				component: () => import("../pages/Users/Edit.vue"),
			},
		],
	},
]

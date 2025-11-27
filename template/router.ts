export default [
	{
		path: "/${rename_kebabCase}s",
		children: [
			{
				path: "",
				name: "${rename_kebabCase}s",
				component: () => import("../pages/${rename_pascalCase}s/List.vue"),
			},
			{
				path: ":${rename_camelCase}Id",
				name: "${rename_kebabCase}",
				component: () => import("../pages/${rename_pascalCase}s/Show.vue"),
			},
			{
				path: ":${rename_camelCase}Id/edit",
				name: "${rename_kebabCase}-edit",
				component: () => import("../pages/${rename_pascalCase}s/Edit.vue"),
			},
			{
				path: "create",
				name: "${rename_kebabCase}-create",
				component: () => import("../pages/${rename_pascalCase}s/Create.vue"),
			},
		],
	},
]

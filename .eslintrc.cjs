module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
		es2021: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"plugin:@typescript-eslint/recommended",
		"@vue/eslint-config-typescript/recommended",
		"plugin:prettier/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020,
		parser: "@typescript-eslint/parser",
		sourceType: "module",
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"@typescript-eslint/no-explicit-any": "off",
		"vue/multi-word-component-names": "off",
		"vue/html-self-closing": [
			"error",
			{
				html: {
					void: "always",
					normal: "always",
					component: "always",
				},
				svg: "always",
				math: "always",
			},
		],
		"prettier/prettier": [
			"error",
			{
				tabWidth: 2,
				useTabs: true,
				singleQuote: false,
				semi: false,
				trailingComma: "es5",
				bracketSpacing: true,
				arrowParens: "always",
			},
		],
	},
	overrides: [
		{
			files: ["**/*.ts", "**/*.tsx"],
			rules: {
				"@typescript-eslint/explicit-module-boundary-types": "off",
			},
		},
	],
	ignorePatterns: ["**/assets/css/presets/*", "src/assets/css/presets/*"],
}

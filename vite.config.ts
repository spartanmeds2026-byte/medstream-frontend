import dotenv from "dotenv"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"
import { fileURLToPath, URL } from "node:url"
import { createHtmlPlugin } from "vite-plugin-html"

dotenv.config()

export default defineConfig({
	preview: {
		port: 5173,
	},
	build: {
		commonjsOptions: {
			include: ["tailwind.config.js", "node_modules/**"],
		},
	},
	optimizeDeps: {
		include: ["tailwind-config"],
	},
	plugins: [
		vue(),
		svgLoader(),
		createHtmlPlugin({
			minify: false,
			inject: {
				data: {
					project: process.env.VITE_PROJECT_PORTAL,
					title: process.env.VITE_PROJECT_NAME,
					description: process.env.VITE_PROJECT_DESCRIPTION,
					url: process.env.VITE_PROJECT_FRONT_URL,
				},
			},
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"tailwind-config": fileURLToPath(
				new URL("./tailwind.config.js", import.meta.url)
			),
		},
	},
})

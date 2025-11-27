declare module "tailwindcss/lib/util/color" {
	const parseColor = (value: string): { color: Array<string> } => {
		const colors = value.split(",")
		return { color: colors }
	}
	export { parseColor }
}

declare module "tailwind-config" {
	const config: Config
	export default config
}

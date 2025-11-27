import _ from "lodash"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { input, select } from "@inquirer/prompts"
import { exec } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const Templates = {
	"interface.ts": {
		in: ["template"],
		out: ["src", "interfaces"],
		fileNameOrig: "interface.ts",
		fileNameDest: "camelCase",
		ext: ".ts",
		update: {
			filePath: ["src", "interfaces"],
			fileName: "index.ts",
			content: [
				{
					last: 'export * as ${rename_pascalCase}Interfaces from "./${rename_camelCase}"\n',
				},
			],
		},
	},
	"api.ts": {
		in: ["template"],
		out: ["src", "api"],
		fileNameOrig: "api.ts",
		fileNameDest: "camelCase",
		ext: ".ts",
		update: {
			filePath: ["src", "api"],
			fileName: "index.ts",
			content: [
				{
					last: 'export * as ${rename_pascalCase}Api from "./${rename_camelCase}"\n',
				},
			],
		},
	},
	"router.ts": {
		in: ["template"],
		out: ["src", "router"],
		fileNameOrig: "router.ts",
		fileNameDest: "camelCase",
		ext: "s.ts",
		update: {
			filePath: ["src", "router"],
			fileName: "index.ts",
			content: [
				{
					first: 'import ${rename_camelCase}s from "./${rename_camelCase}s"\n',
				},
				{
					regex: "\n			...${rename_camelCase}s,\n",
					remplace: (fileContent, content) =>
						fileContent.replace(/children:\s*\[([\s\S]*?)\]/m, (match, p1) => {
							const endsWithComma = p1.trim().endsWith(",")
							return `children: [\n			${p1.trim()}${endsWithComma ? "" : ","}${content}		]`
						}),
				},
			],
		},
	},
	"s9-menu.ts": {
		in: ["src", "main"],
		fileNameOrig: "s9-menu.ts",
		update: {
			filePath: ["src", "main"],
			fileName: "s9-menu.ts",
			content: [
				{
					regex: `\n	{
		icon: "Package",
		pageName: "\${rename_kebabCase}s",
		title: "\${rename_startCase}s",
		permission: "\${rename_snakeCase}s",
	},\n`,
					remplace: (fileContent, content) =>
						fileContent.replace(
							/export const headerMenu:\s*Array<Menu \| "divider"> = \[([\s\S]*?)(?<!\s),?\s*]\s*$/m,
							(match, p1) => {
								const endsWithComma = p1.trim().endsWith(",")
								return `export const headerMenu: Array<Menu | "divider"> = [\n	${p1.trim()}${endsWithComma ? "" : ","}${content}]\n`
							}
						),
				},
			],
		},
	},
	"Create.vue": {
		in: ["template", "formio"],
		out: ["src", "pages", "pascalCase"],
		fileNameOrig: "Create.vue",
		fileNameDest: "Create",
		ext: ".vue",
	},
	"Show.vue": {
		in: ["template", "formio"],
		out: ["src", "pages", "pascalCase"],
		fileNameOrig: "Show.vue",
		fileNameDest: "Show",
		ext: ".vue",
	},
	"Edit.vue": {
		in: ["template", "formio"],
		out: ["src", "pages", "pascalCase"],
		fileNameOrig: "Edit.vue",
		fileNameDest: "Edit",
		ext: ".vue",
	},
	"List.vue": {
		in: ["template", "formio"],
		out: ["src", "pages", "pascalCase"],
		fileNameOrig: "List.vue",
		fileNameDest: "List",
		ext: ".vue",
	},
	"TableList.vue": {
		in: ["template", "formio", "partials"],
		out: ["src", "pages", "pascalCase", "partials"],
		fileNameOrig: "TableList.vue",
		fileNameDest: "TableList",
		ext: ".vue",
	},
}

function replacePlaceholders(content, replacements) {
	let result = content
	Object.keys(replacements).forEach((key) => {
		const regex = new RegExp(`\\$\\{rename_${key}\\}`, "g")
		result = result.replace(regex, replacements[key])
	})
	return result
}

const createModule = ({ name, type, formioUrl, apiSlug }) => {
	Object.keys(Templates).forEach((template) => {
		const replacements = {
			...name,
			formioUrl,
			apiSlug,
		}

		// Actualizar Imports
		if (Templates[template].update)
			updateImportFiles(Templates[template].update, replacements)

		if (!Templates[template].in || !Templates[template].out) return

		// Ruta original del template
		const filePathOrig = Templates[template].in
			.map((p) => (name[p] ? `${name[p]}s` : p))
			.join("/")
		const fileNameOrig = `${Templates[template].fileNameOrig}`
		const pathFileOrig = path.join(__dirname, filePathOrig, fileNameOrig)

		console.log(`Template Path: ${filePathOrig}/${fileNameOrig}`)
		if (!fs.existsSync(pathFileOrig))
			return console.log(`File ${filePathOrig}/${fileNameOrig} does not exist`)

		// Ruta de destino
		const filePathDest = Templates[template].out
			.map((p) => (name[p] ? `${name[p]}s` : p))
			.join("/")
		const fileNameDest = `${name[Templates[template].fileNameDest] || Templates[template].fileNameDest}${Templates[template].ext}`
		const pathFileDest = path.join(__dirname, filePathDest, fileNameDest)

		// Crear directorios de destino si no existen
		if (!fs.existsSync(path.dirname(pathFileDest))) {
			fs.mkdirSync(path.dirname(pathFileDest), { recursive: true })
			console.log(`Created directory: ${path.dirname(pathFileDest)}`)
		}

		// Verificar si el archivo ya existe
		if (fs.existsSync(pathFileDest))
			return console.log(`File ${filePathDest}/${fileNameDest} already exists`)

		// Leer el contenido de la plantilla, reemplazar placeholders y escribir el archivo de destino
		const fileContent = fs.readFileSync(pathFileOrig, "utf-8")
		const updatedContent = replacePlaceholders(fileContent, replacements)
		fs.writeFileSync(pathFileDest, updatedContent, { encoding: "utf8" })
		console.log(`File ${filePathDest}/${fileNameDest} created`)
	})
}

const updateImportFiles = ({ filePath, fileName, content }, replacements) => {
	// Leer el archivo
	const filePathImport = filePath.join("/")
	const pathFile = path.join(__dirname, filePathImport, fileName)

	if (!fs.existsSync(pathFile))
		return console.log(
			`Imports File ${filePathImport}/${fileName} does not exist.`
		)

	let fileContent = fs.readFileSync(pathFile, "utf-8")

	const processItem = (moduleContent) => {
		const replacedContent = replacePlaceholders(moduleContent, replacements)

		// Verificar si ya existe la importación
		if (fileContent.includes(replacedContent)) {
			console.log(`Import already exists in ${pathFile}`)
			return null
		}

		return replacedContent
	}

	let changed = false

	content.forEach((item) => {
		const firstItemContent = item.first ? processItem(item.first) : null
		const lastItemContent = item.last ? processItem(item.last) : null
		const regexItemContent = item.regex ? processItem(item.regex) : null

		if (firstItemContent) {
			changed = true
			fileContent = firstItemContent + fileContent
		}

		if (lastItemContent) {
			changed = true
			fileContent = fileContent + lastItemContent
		}

		if (regexItemContent) {
			changed = true
			fileContent = item.remplace(fileContent, regexItemContent)
		}
	})

	// Escribir la nueva línea al archivo index.ts
	if (!changed) return null
	fs.writeFileSync(pathFile, fileContent, { encoding: "utf-8" })
	console.log(`Import updated in ${pathFile}`)
}

// Init
const moduleStructure = {}

try {
	const type = await select({
		message: "Select the type of module:",
		choices: [
			{ name: "Crud Formio", value: "Formio" },
			{ name: "Crud Simple Form", value: "SimpleForm" },
		],
	})
	moduleStructure.type = type

	if (type === "Formio") {
		let moduleName = await input({
			message: `Module Name: \n Example: Products\n`,
			default: "Examples",
			required: true,
		})
		if (moduleName.endsWith("s")) moduleName = moduleName.slice(0, -1)
		moduleStructure.name = {
			normal: moduleName,
			pascalCase: _.upperFirst(_.camelCase(moduleName)),
			camelCase: _.camelCase(moduleName),
			kebabCase: _.kebabCase(moduleName),
			snakeCase: _.snakeCase(moduleName),
			startCase: _.startCase(moduleName),
			upperCase: _.upperCase(moduleName),
			lowerCase: _.lowerCase(moduleName),
		}

		const formioUrl = await input({
			message: `API Formio URL: \n Example: https://examples.form.io/example\n`,
			default: "https://examples.form.io/example",
			required: true,
		})
		moduleStructure.formioUrl = formioUrl

		const apiSlug = await input({
			message: `API Slug \n Example: ${moduleStructure.name.kebabCase}s\n`,
			default: `${moduleStructure.name.kebabCase}s`,
			required: true,
		})
		moduleStructure.apiSlug = apiSlug
	}

	console.log(moduleStructure)

	createModule({ ...moduleStructure })

	console.log("Module created successfully")

	const runFormat = await select({
		message: "Execute npm run format?",
		choices: [
			{ name: "Yes", value: true },
			{ name: "No", value: false },
		],
	})
	if (runFormat)
		exec("npm run format", (error, stdout) => {
			console.log(`Resultado: ${stdout}`)
		})
} catch (error) {
	console.log(error.message)
}

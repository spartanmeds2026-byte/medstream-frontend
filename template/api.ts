import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { ${rename_pascalCase}Interfaces, ApiInterfaces } from "@/interfaces"

export const get${rename_pascalCase}s = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<${rename_pascalCase}Interfaces.${rename_pascalCase}>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<${rename_pascalCase}Interfaces.${rename_pascalCase}>
	>(`${defaultApiUrl}/${rename_apiSlug}`, { params })
	return response.data.data
}

export const get${rename_pascalCase}ById = async (
	${rename_camelCase}Id: number
): Promise<${rename_pascalCase}Interfaces.${rename_pascalCase}> => {
	const response = await axios.get<
		ApiInterfaces.Response<${rename_pascalCase}Interfaces.${rename_pascalCase}>
	>(`${defaultApiUrl}/${rename_apiSlug}/${${rename_camelCase}Id}`)
	return response.data.data
}

export const create${rename_pascalCase} = async (
	${rename_camelCase}: ${rename_pascalCase}Interfaces.${rename_pascalCase}
): Promise<${rename_pascalCase}Interfaces.${rename_pascalCase}> => {
	const response = await axios.post<
		ApiInterfaces.Response<${rename_pascalCase}Interfaces.${rename_pascalCase}>
	>(`${defaultApiUrl}/${rename_apiSlug}`, ${rename_camelCase})
	return response.data.data
}

export const update${rename_pascalCase} = async (
	${rename_camelCase}Id: number,
	${rename_camelCase}: ${rename_pascalCase}Interfaces.${rename_pascalCase}
): Promise<${rename_pascalCase}Interfaces.${rename_pascalCase}> => {
	const response = await axios.put<
		ApiInterfaces.Response<${rename_pascalCase}Interfaces.${rename_pascalCase}>
	>(`${defaultApiUrl}/${rename_apiSlug}/${${rename_camelCase}Id}`, ${rename_camelCase})
	return response.data.data
}

export const delete${rename_pascalCase} = async (
	${rename_camelCase}Id: number
): Promise<${rename_pascalCase}Interfaces.${rename_pascalCase}> => {
	const response = await axios.delete<
		ApiInterfaces.Response<${rename_pascalCase}Interfaces.${rename_pascalCase}>
	>(`${defaultApiUrl}/${rename_apiSlug}/${${rename_camelCase}Id}`)
	return response.data.data
}

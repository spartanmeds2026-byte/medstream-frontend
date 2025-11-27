import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { CategoryInterfaces, ApiInterfaces } from "@/interfaces"

export const getCategories = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<CategoryInterfaces.Category>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<CategoryInterfaces.Category>
	>(`${defaultApiUrl}/categories`, { params })
	return response.data.data
}

export const getCategorieById = async (
	categorieId: number
): Promise<CategoryInterfaces.Category> => {
	const response = await axios.get<
		ApiInterfaces.Response<CategoryInterfaces.Category>
	>(`${defaultApiUrl}/categories/${categorieId}`)
	return response.data.data
}

export const createCategorie = async (
	categorie: CategoryInterfaces.Category
): Promise<CategoryInterfaces.Category> => {
	const response = await axios.post<
		ApiInterfaces.Response<CategoryInterfaces.Category>
	>(`${defaultApiUrl}/categories`, categorie)
	return response.data.data
}

export const updateCategorie = async (
	categorieId: number,
	categorie: CategoryInterfaces.Category
): Promise<CategoryInterfaces.Category> => {
	const response = await axios.put<
		ApiInterfaces.Response<CategoryInterfaces.Category>
	>(`${defaultApiUrl}/categories/${categorieId}`, categorie)
	return response.data.data
}

export const deleteCategorie = async (
	categorieId: number
): Promise<CategoryInterfaces.Category> => {
	const response = await axios.delete<
		ApiInterfaces.Response<CategoryInterfaces.Category>
	>(`${defaultApiUrl}/categories/${categorieId}`)
	return response.data.data
}

import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { ProductInterfaces, ApiInterfaces } from "@/interfaces"

export const getProducts = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<ProductInterfaces.Product>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products`, { params })
	return response.data.data
}

export const getFeaturedProducts = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<ProductInterfaces.Product>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products/featured-on-website`, { params })
	return response.data.data
}

export const getProductById = async (
	productId: number
): Promise<ProductInterfaces.Product> => {
	const response = await axios.get<
		ApiInterfaces.Response<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products/${productId}`)
	return response.data.data
}

export const createProduct = async (
	product: ProductInterfaces.Product
): Promise<ProductInterfaces.Product> => {
	const response = await axios.post<
		ApiInterfaces.Response<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products`, product)
	return response.data.data
}

export const updateProduct = async (
	productId: number,
	product: ProductInterfaces.Product
): Promise<ProductInterfaces.Product> => {
	const response = await axios.put<
		ApiInterfaces.Response<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products/${productId}`, product)
	return response.data.data
}

export const deleteProduct = async (
	productId: number
): Promise<ProductInterfaces.Product> => {
	const response = await axios.delete<
		ApiInterfaces.Response<ProductInterfaces.Product>
	>(`${defaultApiUrl}/products/${productId}`)
	return response.data.data
}

export const getLogOrdersByProductId = async (
	productId: number
): Promise<ProductInterfaces.LogOrder> => {
	const response = await axios.get<
		ApiInterfaces.Response<ProductInterfaces.LogOrder>
	>(`${defaultApiUrl}/orders/${productId}/product`)
	return response.data.data
}

import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { OrderInterfaces, ApiInterfaces } from "@/interfaces"

export const getOrders = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<OrderInterfaces.Order>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders`, { params })
	return response.data.data
}

export const getOrderById = async (
	orderId: number,
	params?: ApiInterfaces.Meta
): Promise<OrderInterfaces.Order> => {
	const response = await axios.get<
		ApiInterfaces.Response<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders/${orderId}`, { params })
	return response.data.data
}

export const createOrder = async (
	order: OrderInterfaces.Order,
	state?: string
): Promise<OrderInterfaces.Order> => {
	const response = await axios.post<
		ApiInterfaces.Response<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders`, {
		...order,
		state: state || "sale",
	})
	return response.data.data
}

export const updateOrder = async (
	orderId: number,
	order: OrderInterfaces.Order,
	state?: string
): Promise<OrderInterfaces.Order> => {
	const response = await axios.put<
		ApiInterfaces.Response<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders/${orderId}`, {
		...order,
		state: state || "sale",
	})
	return response.data.data
}

export const deleteOrder = async (
	orderId: number
): Promise<OrderInterfaces.Order> => {
	const response = await axios.delete<
		ApiInterfaces.Response<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders/${orderId}`)
	return response.data.data
}

export const getDraftOrders = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<OrderInterfaces.Order>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<OrderInterfaces.Order>
	>(`${defaultApiUrl}/orders/draft`, { params })
	return response.data.data
}

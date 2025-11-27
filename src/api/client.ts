import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { ClientInterfaces, ApiInterfaces } from "@/interfaces"

export const getClients = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<ClientInterfaces.Client>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients`, { params })
	return response.data.data
}

export const getClientById = async (
	clientId: number
): Promise<ClientInterfaces.Client> => {
	const response = await axios.get<
		ApiInterfaces.Response<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients/${clientId}`)
	return response.data.data
}

export const getClientByUserId = async (
	userId: number
): Promise<ClientInterfaces.Client> => {
	const response = await axios.get<
		ApiInterfaces.Response<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients/user/${userId}`)
	return response.data.data
}

export const createClient = async (
	client: ClientInterfaces.Client
): Promise<ClientInterfaces.Client> => {
	const response = await axios.post<
		ApiInterfaces.Response<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients`, client)
	return response.data.data
}

export const updateClient = async (
	clientId: number,
	client: ClientInterfaces.Client
): Promise<ClientInterfaces.Client> => {
	const response = await axios.put<
		ApiInterfaces.Response<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients/${clientId}`, client)
	return response.data.data
}

export const deleteClient = async (
	clientId: number
): Promise<ClientInterfaces.Client> => {
	const response = await axios.delete<
		ApiInterfaces.Response<ClientInterfaces.Client>
	>(`${defaultApiUrl}/clients/${clientId}`)
	return response.data.data
}

export const getUnassignedClients = async (): Promise<
	ClientInterfaces.Client[]
> => {
	const response = await axios.get<
		ApiInterfaces.Response<ClientInterfaces.Client[]>
	>(`${defaultApiUrl}/clients/unassigned/list`)
	return response.data.data
}

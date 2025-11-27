import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { UserInterfaces, ApiInterfaces, ClientInterfaces } from "@/interfaces"

export const getUsers = async (
	params?: ApiInterfaces.Meta
): Promise<ApiInterfaces.StructuredPagination<UserInterfaces.User>> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<UserInterfaces.User>
	>(`${defaultApiUrl}/users`, { params })
	return response.data.data
}

export const getUserById = async (
	userId: number
): Promise<UserInterfaces.User> => {
	const response = await axios.get<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/users/${userId}`
	)
	return response.data.data
}

export const createUser = async (
	user: UserInterfaces.User
): Promise<UserInterfaces.User> => {
	const response = await axios.post<
		ApiInterfaces.Response<UserInterfaces.User>
	>(`${defaultApiUrl}/users`, user)
	return response.data.data
}

export const updateUser = async (
	userId: number,
	user: UserInterfaces.User
): Promise<UserInterfaces.User> => {
	const response = await axios.put<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/users/${userId}`,
		user
	)
	return response.data.data
}

export const deleteUser = async (
	userId: number
): Promise<UserInterfaces.User> => {
	const response = await axios.delete<
		ApiInterfaces.Response<UserInterfaces.User>
	>(`${defaultApiUrl}/users/${userId}`)
	return response.data.data
}

export const inviteUser = async (userId: number): Promise<string> => {
	const response = await axios.get<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/users/${userId}/invite`
	)
	return response.data.data
}

export const getAddressByCustomer =
	async (): Promise<ClientInterfaces.Address> => {
		const response = await axios.get<
			ApiInterfaces.Response<ClientInterfaces.Address>
		>(`${defaultApiUrl}/addresses`)
		return response.data.data
	}

export const createAddressByCustomer = async (
	address: ClientInterfaces.Address
): Promise<ClientInterfaces.Address> => {
	const response = await axios.post<
		ApiInterfaces.Response<ClientInterfaces.Address>
	>(`${defaultApiUrl}/addresses`, address)
	return response.data.data
}

export const assignAdminRoleToUser = async (
	userId: number
): Promise<string> => {
	const response = await axios.get<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/users/${userId}/role/assignment/admin`
	)
	return response.data.data
}

export const assignUserToCustomer = async (
	userId: number,
	customerId: number
): Promise<string> => {
	const response = await axios.get<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/users/${userId}/assignment/${customerId}`
	)
	return response.data.data
}

export const unassignUserToCustomer = async (
	userId: number
): Promise<string> => {
	const response = await axios.delete<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/users/${userId}/unassignment`
	)
	return response.data.data
}

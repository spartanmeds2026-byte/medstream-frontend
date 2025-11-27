import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { CreditAppInterfaces, ApiInterfaces } from "@/interfaces"

export const getCreditApps = async (
	params?: ApiInterfaces.Meta
): Promise<
	ApiInterfaces.StructuredPagination<CreditAppInterfaces.CreditApp>
> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<CreditAppInterfaces.CreditApp>
	>(`${defaultApiUrl}/credit-apps`, { params })
	return response.data.data
}

export const getCreditAppById = async (
	creditAppId: number
): Promise<CreditAppInterfaces.CreditApp> => {
	const response = await axios.get<
		ApiInterfaces.Response<CreditAppInterfaces.CreditApp>
	>(`${defaultApiUrl}/credit-apps/${creditAppId}`)
	return response.data.data
}

export const createCreditApp = async (
	creditApp: CreditAppInterfaces.CreditApp
): Promise<CreditAppInterfaces.CreditApp> => {
	const response = await axios.post<
		ApiInterfaces.Response<CreditAppInterfaces.CreditApp>
	>(`${defaultApiUrl}/credit-apps`, creditApp)
	return response.data.data
}

export const updateCreditApp = async (
	creditAppId: number,
	creditApp: CreditAppInterfaces.CreditApp
): Promise<CreditAppInterfaces.CreditApp> => {
	const response = await axios.put<
		ApiInterfaces.Response<CreditAppInterfaces.CreditApp>
	>(`${defaultApiUrl}/credit-apps/${creditAppId}`, creditApp)
	return response.data.data
}

export const deleteCreditApp = async (
	creditAppId: number
): Promise<CreditAppInterfaces.CreditApp> => {
	const response = await axios.delete<
		ApiInterfaces.Response<CreditAppInterfaces.CreditApp>
	>(`${defaultApiUrl}/credit-apps/${creditAppId}`)
	return response.data.data
}

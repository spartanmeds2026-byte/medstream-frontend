import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { PurchaseHistoryInterfaces, ApiInterfaces } from "@/interfaces"

export const getPurchaseHistorys = async (
	params?: ApiInterfaces.Meta
): Promise<
	ApiInterfaces.StructuredPagination<PurchaseHistoryInterfaces.PurchaseHistory>
> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<PurchaseHistoryInterfaces.PurchaseHistory>
	>(`${defaultApiUrl}/products/ordered`, { params })
	return response.data.data
}

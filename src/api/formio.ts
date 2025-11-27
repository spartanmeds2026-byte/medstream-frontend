import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { FormioInterfaces } from "@/interfaces"

export const getFormJson = async (url: string) => {
	const buildURL = url.startsWith("http") ? url : `${defaultApiUrl}${url}`
	const response = await axios.get<FormioInterfaces.FormioJSON>(buildURL, {
		withCredentials: false,
	})
	return response.data
}

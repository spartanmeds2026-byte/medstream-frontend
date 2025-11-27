import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { UserInterfaces, AuthInterfaces, ApiInterfaces } from "@/interfaces"

export const loginPassword = async (credentials: {
	email: string
	password: string
}): Promise<UserInterfaces.User> => {
	const response = await axios.post<
		ApiInterfaces.Response<UserInterfaces.User>
	>(`${defaultApiUrl}/auth/login/password`, credentials)
	return response.data.data
}

export const loginStytch = async (credentials: {
	email: string
}): Promise<AuthInterfaces.StytchResponse> => {
	const response = await axios.post<
		ApiInterfaces.Response<AuthInterfaces.StytchResponse>
	>(`${defaultApiUrl}/auth/login`, credentials)
	return response.data.data
}

export const loginCallbackStytch = async (
	credentials: AuthInterfaces.StytchCallBack
): Promise<UserInterfaces.User> => {
	const response = await axios.get<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/auth/stytch/callback`,
		{
			params: credentials,
		}
	)
	return response.data.data
}

export const loginSMS = async (credentials: {
	phone: string
}): Promise<AuthInterfaces.StytchSMSResponse> => {
	const response = await axios.post<
		ApiInterfaces.Response<AuthInterfaces.StytchSMSResponse>
	>(`${defaultApiUrl}/auth/stytch/sms`, credentials)
	return response.data.data
}

export const verifyCodeSMS = async (
	credentials: AuthInterfaces.StytchSMSVerify
): Promise<UserInterfaces.User> => {
	const response = await axios.post<
		ApiInterfaces.Response<UserInterfaces.User>
	>(`${defaultApiUrl}/auth/stytch/sms/verify`, credentials)
	return response.data.data
}

export const logout = async (): Promise<void> => {
	await axios.post<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/auth/logout`
	)
}

export const simulateLogin = async (
	user_id: number
): Promise<UserInterfaces.User> => {
	const response = await axios.post<
		ApiInterfaces.Response<UserInterfaces.User>
	>(`${defaultApiUrl}/auth/login/simulate`, { user_id })
	return response.data.data
}

export const exitSimulateLogin = async (): Promise<void> => {
	await axios.post<ApiInterfaces.Response<string>>(
		`${defaultApiUrl}/auth/login/simulate/exit`
	)
}

import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import {
	UserInterfaces,
	ApiInterfaces,
	RolesAndPermissionsInterfaces,
} from "@/interfaces"

export const authCheck = async (): Promise<UserInterfaces.User> => {
	const response = await axios.get<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/profile/check/whoami`
	)
	return response.data.data
}

export const authPermissionsMap =
	async (): Promise<RolesAndPermissionsInterfaces.PermissionMaps> => {
		const response = await axios.get<
			ApiInterfaces.Response<RolesAndPermissionsInterfaces.PermissionMaps>
		>(`${defaultApiUrl}/profile/permissions/map`)
		return response.data.data
	}

export const updateProfile = async (updateProfile: {
	first_name: string
	last_name: string
}): Promise<UserInterfaces.User> => {
	const response = await axios.put<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/profile/update`,
		updateProfile
	)
	return response.data.data
}

export const updateProfilePicture = async (updatePicture: {
	picture: string
}): Promise<UserInterfaces.User> => {
	const response = await axios.put<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/profile/update/picture`,
		updatePicture
	)
	return response.data.data
}

export const updateProfilePassword = async (updatePassword: {
	password: string
	new_password: string
	confirm_new_password: string
}): Promise<UserInterfaces.User> => {
	const response = await axios.put<ApiInterfaces.Response<UserInterfaces.User>>(
		`${defaultApiUrl}/profile/update/password`,
		updatePassword
	)
	return response.data.data
}

import { axios } from "@/utils/axios"
import { defaultApiUrl } from "@/defaultConfig"
import { ApiInterfaces, RolesAndPermissionsInterfaces } from "@/interfaces"

export const getRoles = async (
	params?: ApiInterfaces.Meta
): Promise<
	ApiInterfaces.StructuredPagination<RolesAndPermissionsInterfaces.Role>
> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<RolesAndPermissionsInterfaces.Role>
	>(`${defaultApiUrl}/permissions/roles`, { params })
	return response.data.data
}

export const getRoleById = async (
	roleId: number
): Promise<RolesAndPermissionsInterfaces.Role> => {
	const response = await axios.get<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Role>
	>(`${defaultApiUrl}/permissions/roles/${roleId}`)
	return response.data.data
}

export const createRole = async (
	role: RolesAndPermissionsInterfaces.Role
): Promise<RolesAndPermissionsInterfaces.Role> => {
	const response = await axios.post<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Role>
	>(`${defaultApiUrl}/permissions/roles`, role)
	return response.data.data
}

export const updateRole = async (
	roleId: number,
	role: RolesAndPermissionsInterfaces.Role
): Promise<RolesAndPermissionsInterfaces.Role> => {
	const response = await axios.put<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Role>
	>(`${defaultApiUrl}/permissions/roles/${roleId}`, role)
	return response.data.data
}

export const deleteRole = async (
	roleId: number
): Promise<RolesAndPermissionsInterfaces.Role> => {
	const response = await axios.delete<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Role>
	>(`${defaultApiUrl}/permissions/roles/${roleId}`)
	return response.data.data
}

export const getModules = async (
	params?: ApiInterfaces.Meta
): Promise<
	ApiInterfaces.StructuredPagination<RolesAndPermissionsInterfaces.Module>
> => {
	const response = await axios.get<
		ApiInterfaces.ResponseWithPagination<RolesAndPermissionsInterfaces.Module>
	>(`${defaultApiUrl}/module`, { params })
	return response.data.data
}

export const getRolePermissions = async (
	roleId: number
): Promise<RolesAndPermissionsInterfaces.Permission[]> => {
	const response = await axios.get<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Permission[]>
	>(`${defaultApiUrl}/permissions/permissions-map/roles/${roleId}`)
	return response.data.data
}

export const AssignModuleToRole = async (
	roleId: number,
	moduleId: number,
	permissions: RolesAndPermissionsInterfaces.Permission
): Promise<RolesAndPermissionsInterfaces.Permission> => {
	const response = await axios.post<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Permission>
	>(
		`${defaultApiUrl}/permissions/permissions-map/roles/${roleId}/modules/${moduleId}`,
		permissions
	)
	return response.data.data
}

export const getRolesByUser = async (
	userId: number
): Promise<RolesAndPermissionsInterfaces.Role[]> => {
	const response = await axios.get<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.Role[]>
	>(`${defaultApiUrl}/permissions/roles/user/${userId}`)
	return response.data.data
}

export const AssignRoleToUser = async (assignPermissions: {
	userId: number
	roleId: number
}): Promise<RolesAndPermissionsInterfaces.PermissionMapsByUser> => {
	const response = await axios.post<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.PermissionMapsByUser>
	>(`${defaultApiUrl}/permissions/roles/assign`, assignPermissions)
	return response.data.data
}

export const deleteRoleToUser = async (
	userId: number,
	roleId: number
): Promise<RolesAndPermissionsInterfaces.PermissionMapsByUser> => {
	const response = await axios.delete<
		ApiInterfaces.Response<RolesAndPermissionsInterfaces.PermissionMapsByUser>
	>(`${defaultApiUrl}/permissions/roles/${roleId}/user/${userId}`)
	return response.data.data
}

import { ApiInterfaces } from "@/interfaces"

export interface PermissionActions {
	list: boolean
	create: boolean
	read: boolean
	update: boolean
	del: boolean
	export: boolean
}

export interface Permission
	extends ApiInterfaces.Timestamp,
		PermissionActions,
		PermissionRelations {
	id?: number
	module_id?: number
	role_id?: number
}

export interface PermissionRelations {
	modules?: Module
	roles?: Role
}

export type PermissionMaps = {
	[key: string]: PermissionActions
}

export interface Role extends ApiInterfaces.Timestamp, RoleRelations {
	id: number
	name: string
	key: string
}

export interface RoleRelations {
	permissions?: Permission[]
}

export interface Module extends ApiInterfaces.Timestamp, ModuleRelations {
	id: number
	name: string
	key: string
}

export interface ModuleRelations {
	permissions?: Permission[]
}

export interface PermissionMapsByUser extends ApiInterfaces.Timestamp {
	id: number
	user_id: number
	role_id: number
	default: boolean
}

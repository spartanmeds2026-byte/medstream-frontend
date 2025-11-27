import {
	ApiInterfaces,
	CompanyInterfaces,
	ClientInterfaces,
	SalesRepInterfaces,
	RolesAndPermissionsInterfaces,
} from "@/interfaces"

export interface User extends ApiInterfaces.Timestamp, UserRelations {
	id: number
	first_name: string
	last_name: string | null
	email: string
	picture?: string | null
	password?: string
	super_admin?: boolean
	is_admin?: boolean
	external_token?: string
	chat_digest?: string
	simulated?: boolean
	iat?: number
	admin_id?: number
}

export interface UserRelations {
	role?: RolesAndPermissionsInterfaces.Role
	company?: CompanyInterfaces.Company
	salesRep?: SalesRepInterfaces.SalesRep
	client?: ClientInterfaces.Client
}

export interface Profile {
	company: string
}

import { UserInterfaces } from "@/interfaces"

export interface Response<T> {
	data: T
	code: number
}

export interface StructuredPagination<T> {
	meta: Meta
	results: T[]
}

export interface ResponseWithPagination<T>
	extends Response<StructuredPagination<T>> {}

export interface Meta {
	limit?: number
	page?: number
	total?: number
	sortField?: string
	sortOrder?: number | null
	filters?: any
	relations?: string[]
	type?: string | null
	last_message?: boolean
}

export interface Timestamp {
	created_at?: Date | string | null
	updated_at?: Date | string | null
	created_by?: UserInterfaces.User
	updated_by?: UserInterfaces.User
}

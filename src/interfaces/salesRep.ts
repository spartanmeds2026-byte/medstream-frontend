import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {
	name: string
	email: string
	phone: string
}

export interface SalesRep
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		SalesRepRelations {
	id: number
	data: SalesRepForm
	odoo_id: number
}

export interface SalesRepRelations {}

export interface SalesRepForm {}

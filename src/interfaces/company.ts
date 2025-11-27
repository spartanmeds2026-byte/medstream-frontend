import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {
	name: string
	image: string
	email: string
	phone: string
}

export interface Company
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		CompanyRelations {
	id: number
	data: CompanyForm
	odoo_id: number
}

export interface CompanyRelations {}

export interface CompanyForm {}

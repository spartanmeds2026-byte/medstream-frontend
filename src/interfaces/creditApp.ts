import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {}

export interface CreditApp
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		CreditAppRelations {
	id?: number
	data: CreditAppForm
}

export interface CreditAppRelations {}

export interface CreditAppForm {}

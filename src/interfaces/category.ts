import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {
	name: string
	image: string
}

export interface Category
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		CategoryRelations {
	id: number
	data: CategoryForm
}

export interface CategoryRelations {}

export interface CategoryForm {}

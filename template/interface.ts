import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {}

export interface ${rename_pascalCase}
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		${rename_pascalCase}Relations {
	id?: number
	data: ${rename_pascalCase}Form
}

export interface ${rename_pascalCase}Relations {}

export interface ${rename_pascalCase}Form {}

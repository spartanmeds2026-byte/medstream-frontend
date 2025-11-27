import {
	ApiInterfaces,
	ClientInterfaces,
	ProductInterfaces,
	UserInterfaces,
} from "@/interfaces"

export interface FieldsSearch {
	order_number?: string
	date?: Date
	total?: number
	state?: string
}

export interface Order
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		OrderRelations {
	id?: number
	data: OrderForm
	client_id: number
}

export interface OrderRelations {}

export interface OrderForm {
	customer1: ClientInterfaces.Client
	salesMan: SalesMan
	order: string
	date: Date
	shipDate: Date
	po: string
	terms: string
	firstNameBilling: string
	lastNameBilling: string
	address1Billing: string
	address2Billing: string
	cityBilling: string
	stateBilling: string
	zipBilling: string
	countryBilling: string
	firstNameShipping: string
	lastNameShipping: string
	address1Shipping: string
	address2Shipping: string
	cityShipping: string
	stateShipping: string
	zipShipping: string
	countryShipping: string
	dataGrid: DataGrid[]
	notes: string
	tax: string
	submit: boolean
	total2: number
	total1: number
}

export interface DataGrid {
	product: ProductInterfaces.Product
	quantity: number
	price: number
	total: number
}

export interface SalesMan extends UserInterfaces.User {}

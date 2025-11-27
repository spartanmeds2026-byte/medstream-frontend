import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {
	sku: string
	total_orders: number
	last_order_price: number
	title: string
}

export interface PurchaseHistory
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		PurchaseHistoryRelations {
	id: number
	data: PurchaseHistoryForm
}

export interface PurchaseHistoryRelations {}

export interface PurchaseHistoryForm {}

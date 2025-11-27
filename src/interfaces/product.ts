import { ApiInterfaces, OrderInterfaces } from "@/interfaces"

export interface FieldsSearch {
	image: string
	sku: string
	title: string
	brand: string
	quantity: number
	category: string
	description: string
	default_price: number
	customer_price: number
}

export interface Product
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		ProductRelations {
	id: number
	data: ProductForm
	odoo: ProductOdoo
}

export interface ProductRelations {}

export interface ProductForm {
	sku: string
	title: string
	brand: string
	primaryImage: any[]
	secondaryImages: any[]
	description1: string
	category: string
	submit: boolean
	quantityAvailable: number
	defaultPrice: number
	customerPrice: number
	createdBy: number
}

export interface ProductOdoo {
	id: number
	activity_ids: any[]
	activity_state: boolean
	activity_user_id: boolean
	activity_type_id: boolean
	activity_type_icon: boolean
	activity_date_deadline: boolean
	my_activity_date_deadline: boolean
	activity_summary: boolean
	activity_exception_decoration: boolean
	activity_exception_icon: boolean
	activity_calendar_event_id: boolean
	message_is_follower: boolean
	message_follower_ids: any[]
	message_partner_ids: any[]
	message_ids: any[]
	has_message: boolean
	message_needaction: boolean
	message_needaction_counter: number
	message_has_error: boolean
	message_has_error_counter: number
	message_attachment_count: number
	rating_ids: any[]
	website_message_ids: any[]
	message_has_sms_error: boolean
	price_extra: number
	lst_price: number
	default_code: boolean
	code: boolean
	partner_ref: string
	active: boolean
	product_tmpl_id: Array<number | string>
	barcode: string
	product_template_attribute_value_ids: any[]
	product_template_variant_value_ids: any[]
	combination_indices: string
	is_product_variant: boolean
	standard_price: number
	volume: number
	weight: number
	pricelist_item_count: number
	product_document_ids: any[]
	product_document_count: number
	packaging_ids: any[]
	additional_product_tag_ids: any[]
	all_product_tag_ids: any[]
	image_variant_1920: boolean
	image_variant_1024: boolean
	image_variant_512: boolean
	image_variant_256: boolean
	image_variant_128: boolean
	can_image_variant_1024_be_zoomed: boolean
	image_1920: boolean
	image_1024: boolean
	image_512: boolean
	image_256: boolean
	image_128: boolean
	can_image_1024_be_zoomed: boolean
	write_date: Date
	display_name: string
	create_uid: Array<number | string>
	create_date: Date
	write_uid: Array<number | string>
	tax_string: string
	stock_quant_ids: number[]
	stock_move_ids: number[]
	qty_available: number
	virtual_available: number
	free_qty: number
	incoming_qty: number
	outgoing_qty: number
	orderpoint_ids: any[]
	nbr_moves_in: number
	nbr_moves_out: number
	nbr_reordering_rules: number
	reordering_min_qty: number
	reordering_max_qty: number
	putaway_rule_ids: any[]
	storage_category_capacity_ids: any[]
	show_on_hand_qty_status_button: boolean
	show_forecasted_qty_status_button: boolean
	valid_ean: boolean
	lot_properties_definition: any[]
	standard_price_update_warning: boolean
	purchased_product_qty: number
	is_in_purchase_order: boolean
	value_svl: number
	quantity_svl: number
	avg_cost: number
	total_value: number
	company_currency_id: Array<number | string>
	stock_valuation_layer_ids: number[]
	valuation: string
	cost_method: string
	has_image: boolean
	avatax_category_id: boolean
	purchase_order_line_ids: any[]
	sales_count: number
	product_catalog_product_is_in_sale_order: boolean
	name: string
	sequence: number
	description: boolean
	description_purchase: string
	description_sale: string
	type: string
	combo_ids: any[]
	service_tracking: string
	categ_id: Array<number | string>
	currency_id: Array<number | string>
	cost_currency_id: Array<number | string>
	list_price: number
	volume_uom_name: string
	weight_uom_name: string
	sale_ok: boolean
	purchase_ok: boolean
	uom_id: Array<number | string>
	uom_name: string
	uom_category_id: Array<number | string>
	uom_po_id: Array<number | string>
	company_id: Array<number | string>
	seller_ids: number[]
	variant_seller_ids: number[]
	color: number
	attribute_line_ids: any[]
	valid_product_template_attribute_line_ids: any[]
	product_variant_ids: number[]
	product_variant_id: Array<number | string>
	product_variant_count: number
	has_configurable_attributes: boolean
	product_tooltip: string
	is_favorite: boolean
	product_tag_ids: any[]
	product_properties: any[]
	taxes_id: any[]
	supplier_taxes_id: any[]
	property_account_income_id: boolean
	property_account_expense_id: boolean
	account_tag_ids: any[]
	fiscal_country_codes: string
	is_storable: boolean
	responsible_id: boolean
	property_stock_production: Array<number | string>
	property_stock_inventory: Array<number | string>
	sale_delay: number
	tracking: string
	description_picking: boolean
	description_pickingout: boolean
	description_pickingin: boolean
	location_id: boolean
	warehouse_id: boolean
	has_available_route_ids: boolean
	route_ids: number[]
	route_from_categ_ids: any[]
	can_be_expensed: boolean
	use_expiration_date: boolean
	expiration_time: number
	use_time: number
	removal_time: number
	alert_time: number
	purchase_method: string
	purchase_line_warn: string
	purchase_line_warn_msg: boolean
	lot_valuated: boolean
	property_account_creditor_price_difference: boolean
	service_type: string
	sale_line_warn: string
	sale_line_warn_msg: boolean
	expense_policy: string
	visible_expense_policy: boolean
	invoice_policy: string
	optional_product_ids: any[]
	service_to_purchase: boolean
	landed_cost_ok: boolean
	split_method_landed_cost: boolean
	expense_policy_tooltip: boolean
	hs_code: boolean
	country_of_origin: boolean
	planning_enabled: boolean
	planning_role_id: boolean
	project_id: boolean
	project_template_id: boolean
	service_policy: string
	x_studio_short_desc: string
	x_studio_length: number
	x_studio_width: number
	x_studio_height: number
	x_studio_char_field_617_1igii0pem: boolean
}

export interface LogOrder extends ApiInterfaces.Timestamp {
	id: number
	order_id: number
	product_id: number
	quantity: number
	price: number
	total: number
	orders: OrderInterfaces.Order
}

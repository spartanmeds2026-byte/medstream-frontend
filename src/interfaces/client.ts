import { ApiInterfaces } from "@/interfaces"

export interface FieldsSearch {
	name: string
	address: string
	phone: string
	email: string
	picture: string
}

export interface Client
	extends ApiInterfaces.Timestamp,
		FieldsSearch,
		ClientRelations {
	id: number
	data: ClientForm
	odoo: ClientOdoo
}

export interface ClientRelations {}

export interface ClientForm {
	firstName: string
	lastName: string
	addressLine1: string
	addressLine2: string
	city: string
	state: string
	zipCode: string
	phoneNumber: string
	email: string
	picture: any[]
	submit: boolean
}

export interface ClientOdoo {
	id: number
	avatax_unique_code: string
	message_is_follower: boolean
	message_follower_ids: number[]
	message_partner_ids: number[]
	message_ids: number[]
	has_message: boolean
	message_needaction: boolean
	message_needaction_counter: number
	message_has_error: boolean
	message_has_error_counter: number
	message_attachment_count: number
	rating_ids: any[]
	website_message_ids: any[]
	message_has_sms_error: boolean
	email_normalized: string
	is_blacklisted: boolean
	message_bounce: number
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
	image_1920: string
	image_1024: string
	image_512: string
	image_256: string
	image_128: string
	avatar_1920: string
	avatar_1024: string
	avatar_512: string
	avatar_256: string
	avatar_128: string
	name: string
	complete_name: string
	title: boolean
	parent_id: boolean
	parent_name: boolean
	child_ids: any[]
	ref: boolean
	lang: string
	active_lang_count: number
	tz: string
	tz_offset: string
	user_id: boolean
	vat: boolean
	vat_label: string
	same_vat_partner_id: boolean
	same_company_registry_partner_id: boolean
	company_registry: boolean
	company_registry_label: string
	bank_ids: any[]
	website: boolean
	comment: boolean
	category_id: any[]
	active: boolean
	employee: boolean
	function: boolean
	type: string
	street: boolean
	street2: boolean
	zip: boolean
	city: boolean
	state_id: boolean
	country_id: boolean
	country_code: boolean
	partner_latitude: number
	partner_longitude: number
	email: string
	email_formatted: string
	phone: boolean
	mobile: boolean
	is_company: boolean
	is_public: boolean
	industry_id: boolean
	company_type: string
	company_id: boolean
	color: number
	user_ids: number[]
	partner_share: boolean
	contact_address: string
	commercial_partner_id: Array<number | string>
	commercial_company_name: boolean
	company_name: boolean
	barcode: boolean
	self: Array<number | string>
	display_name: string
	create_uid: Array<number | string>
	create_date: Date
	write_uid: Array<number | string>
	write_date: Date
	im_status: string
	contact_address_complete: string
	channel_ids: number[]
	contact_address_inline: string
	starred_message_ids: any[]
	image_medium: string
	signup_type: boolean
	meeting_count: number
	meeting_ids: any[]
	calendar_last_notif_ack: Date
	property_product_pricelist: Array<number | string>
	specific_property_product_pricelist: boolean
	ocn_token: boolean
	partner_gid: number
	additional_info: boolean
	phone_sanitized: boolean
	phone_sanitized_blacklisted: boolean
	phone_blacklisted: boolean
	mobile_blacklisted: boolean
	phone_mobile_search: boolean
	certifications_count: number
	certifications_company_count: number
	upcoming_appointment_ids: any[]
	payment_token_ids: any[]
	payment_token_count: number
	signature_count: number
	fiscal_country_codes: string
	partner_vat_placeholder: string
	credit: number
	credit_to_invoice: number
	credit_limit: number
	use_partner_credit_limit: boolean
	show_credit_limit: boolean
	days_sales_outstanding: number
	debit: number
	debit_limit: number
	total_invoiced: number
	currency_id: Array<number | string>
	journal_item_count: number
	property_account_payable_id: Array<number | string>
	property_account_receivable_id: Array<number | string>
	property_account_position_id: boolean
	property_payment_term_id: boolean
	property_supplier_payment_term_id: boolean
	ref_company_ids: any[]
	invoice_ids: any[]
	contract_ids: any[]
	bank_account_count: number
	trust: string
	ignore_abnormal_invoice_date: boolean
	ignore_abnormal_invoice_amount: boolean
	invoice_warn: string
	invoice_warn_msg: boolean
	invoice_sending_method: boolean
	invoice_edi_format: boolean
	invoice_edi_format_store: boolean
	display_invoice_edi_format: boolean
	invoice_template_pdf_report_id: boolean
	display_invoice_template_pdf_report_id: boolean
	supplier_rank: number
	customer_rank: number
	autopost_bills: string
	duplicated_bank_account_partners_count: number
	is_coa_installed: boolean
	property_outbound_payment_method_line_id: boolean
	property_inbound_payment_method_line_id: boolean
	opportunity_ids: any[]
	opportunity_count: number
	document_count: number
	employee_ids: any[]
	employees_count: number
	user_livechat_username: boolean
	project_ids: any[]
	task_ids: any[]
	task_count: number
	property_stock_customer: Array<number | string>
	property_stock_supplier: Array<number | string>
	picking_warn: string
	picking_warn_msg: boolean
	is_ubl_format: boolean
	is_peppol_edi_format: boolean
	peppol_endpoint: boolean
	peppol_eas: boolean
	loyalty_card_count: number
	property_purchase_currency_id: boolean
	purchase_order_count: number
	supplier_invoice_count: number
	purchase_warn: string
	purchase_warn_msg: boolean
	receipt_reminder_email: boolean
	reminder_date_before_receipt: number
	buyer_id: boolean
	avalara_partner_code: boolean
	avalara_exemption_id: boolean
	avalara_show_address_validation: boolean
	online_partner_information: boolean
	box_1099_id: boolean
	purchase_line_ids: any[]
	on_time_rate: number
	sale_order_count: number
	sale_order_ids: any[]
	sale_warn: string
	sale_warn_msg: boolean
	account_represented_company_ids: any[]
	property_delivery_carrier_id: boolean
	followup_next_action_date: boolean
	unreconciled_aml_ids: any[]
	unpaid_invoice_ids: any[]
	unpaid_invoices_count: number
	total_due: number
	total_overdue: number
	followup_status: string
	followup_line_id: boolean
	followup_reminder_type: string
	followup_responsible_id: boolean
	property_ups_carrier_account: boolean
	bill_my_account: boolean
	x_studio_selection_field_65_1ii78pjbm: boolean
	x_studio_qb_salesman: boolean
	x_studio_email_2: boolean
	x_studio_email_3: boolean
	x_studio_email_4: boolean
	x_studio_resale_certificate: boolean
	x_studio_resale_certificate_filename: boolean
	x_studio_certificate_number: boolean
}

export interface Address {
	first_name: string
	last_name: string
	address_1: string
	address_2: string
	city: string
	state: string
	country: string
	zip: string
}

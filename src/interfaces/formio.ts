export interface FormioItem {
	[key: string]: string | number | Record<string, any>
	data: Record<string, any>
}

export interface FormioJSON {
	_id?: string
	machineName?: string
	modified?: Date
	title?: string
	display?: string
	type?: string
	name?: string
	path?: string
	project?: string
	created?: Date
	components?: FormioComponent[]
	owner?: string
	submissionAccess?: Access[]
	access?: Access[]
	tags?: any[]
	_vid?: number
	revisions?: string
	plan?: string
}

export interface Access {
	type?: string
	roles?: string[]
}

export interface FormioComponent {
	input?: boolean
	html?: string
	type?: string
	conditional?: Conditional
	key?: string
	placeholder?: string
	prefix?: string
	customClass?: string
	suffix?: string
	multiple?: boolean
	defaultValue?: null | string
	protected?: boolean
	unique?: boolean
	persistent?: boolean
	hidden?: boolean
	clearOnHide?: boolean
	refreshOn?: string
	redrawOn?: string
	tableView?: boolean
	modalEdit?: boolean
	label?: string
	dataGridLabel?: boolean
	labelPosition?: string
	description?: string
	errorLabel?: string
	tooltip?: string
	hideLabel?: boolean
	tabindex?: string
	disabled?: boolean
	autofocus?: boolean
	dbIndex?: boolean
	customDefaultValue?: string
	calculateValue?: string
	calculateServer?: boolean
	widget?: Widget | null
	attributes?: Attributes
	validateOn?: string
	validate?: FluffyValidate
	overlay?: Overlay
	allowCalculateOverride?: boolean
	encrypted?: boolean
	showCharCount?: boolean
	showWordCount?: boolean
	properties?: Attributes
	allowMultipleMasks?: boolean
	id?: string
	addons?: any[]
	columns?: Column[]
	tree?: boolean
	autoAdjust?: boolean
	lazyLoad?: boolean
	tags?: any[]
	questions?: Question[]
	values?: Question[]
	footer?: string
	width?: string
	height?: string
	penColor?: string
	backgroundColor?: string
	minWidth?: string
	maxWidth?: string
	keepOverlayRatio?: boolean
	size?: string
	leftIcon?: string
	rightIcon?: string
	block?: boolean
	action?: string
	disableOnInvalid?: boolean
	theme?: string
}

export interface Attributes {}

export interface Column {
	components?: ColumnComponent[]
	width?: number
	offset?: number
	push?: number
	pull?: number
	size?: string
	currentWidth?: number
}

export interface ColumnComponent {
	tabindex?: string
	tags?: any[]
	clearOnHide?: boolean
	hidden?: boolean
	input?: boolean
	tableView?: boolean
	inputType?: string
	inputMask?: string
	label?: string
	key?: string
	placeholder?: string
	prefix?: string
	suffix?: string
	multiple?: boolean
	defaultValue?: string
	protected?: boolean
	unique?: boolean
	persistent?: boolean
	validate?: PurpleValidate
	conditional?: Conditional
	type?: string
	customClass?: string
	refreshOn?: string
	redrawOn?: string
	modalEdit?: boolean
	dataGridLabel?: boolean
	labelPosition?: string
	description?: string
	errorLabel?: string
	tooltip?: string
	hideLabel?: boolean
	disabled?: boolean
	autofocus?: boolean
	dbIndex?: boolean
	customDefaultValue?: string
	calculateValue?: string
	calculateServer?: boolean
	widget?: Widget
	attributes?: Attributes
	validateOn?: string
	overlay?: Overlay
	allowCalculateOverride?: boolean
	encrypted?: boolean
	showCharCount?: boolean
	showWordCount?: boolean
	properties?: Attributes
	allowMultipleMasks?: boolean
	mask?: boolean
	inputFormat?: string
	spellcheck?: boolean
	id?: string
	addons?: any[]
	displayMask?: string
	truncateMultipleSpaces?: boolean
	kickbox?: Kickbox
	inputMode?: string
}

export interface Conditional {
	show?: string
	when?: null
	eq?: string
}

export interface Kickbox {
	enabled?: boolean
}

export interface Overlay {
	style?: string
	left?: string
	top?: string
	width?: string
	height?: string
}

export interface PurpleValidate {
	required?: boolean
	minLength?: string
	maxLength?: string
	pattern?: string
	custom?: string
	customPrivate?: boolean
	strictDateValidation?: boolean
	multiple?: boolean
	unique?: boolean
}

export interface Widget {
	type?: string
}

export interface Question {
	value?: string
	label?: string
}

export interface FluffyValidate {
	required?: boolean
	custom?: string
	customPrivate?: boolean
	strictDateValidation?: boolean
	multiple?: boolean
	unique?: boolean
}

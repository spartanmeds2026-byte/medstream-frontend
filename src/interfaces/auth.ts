export interface StytchResponse {
	email_id: string
	request_id: string
	status_code: number
	user_id: string
}
export interface StytchCallBack {
	stytch_token_type: string
	token: string
}

export interface StytchSMSResponse {
	status_code: number
	phone_id: string
	request_id: string
	user_created: boolean
	user_id: string
}

export interface StytchSMSVerify {
	code: string
	method_id: string
}

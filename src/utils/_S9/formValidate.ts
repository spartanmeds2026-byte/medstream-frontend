import { helpers } from "@vuelidate/validators"

export const containsLowercase = helpers.withMessage(
	"This field should be at least one lowercase letter",
	helpers.regex(/^(?=.*[a-z]).+$/)
)
export const containsUppercase = helpers.withMessage(
	"This field should be at least one uppercase letter",
	helpers.regex(/^(?=.*[A-Z]).+$/)
)
export const containsNumber = helpers.withMessage(
	`This field should be at least one number`,
	helpers.regex(/^(?=.*[0-9]).+$/)
)
export const containsSpecial = helpers.withMessage(
	"This field should be at least one special character",
	helpers.regex(/^(?=.*[!@#$%^&*(),.?":{}|<>]).+$/)
)

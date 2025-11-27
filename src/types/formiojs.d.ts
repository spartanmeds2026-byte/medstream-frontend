declare module "formiojs" {
	export class Formio {
		static use?: any
		static createForm(element: any, form: any, options?: any): Promise<any>
		static builder?: any
	}
}

import { defineStore } from "pinia"
import * as lucideIcons from "lucide-vue-next"
type Icon = keyof typeof lucideIcons
export interface NotificationState {
	id: symbol
	icon: {
		name: Icon
		class: string
	}
	title: string
	message: string
}

export const useStore = defineStore("notification", {
	state: (): NotificationState => ({
		id: Symbol(),
		icon: {
			name: "LayersIcon",
			class: "",
		},
		title: "",
		message: "",
	}),
	getters: {
		getNotification(state) {
			return state
		},
		getTitle(state) {
			return state.title
		},
		getMessage(state) {
			return state.message
		},
		getId(state) {
			return state.id
		},
		getIconName(state) {
			return state.icon.name
		},
		getIconClass(state) {
			return state.icon.class
		},
	},
	actions: {
		setNotification(options: Partial<NotificationState>) {
			this.id = Symbol()
			if (options.icon !== undefined) {
				if (options.icon.name !== undefined)
					this.icon.name = options.icon.name as Icon
				if (options.icon.class !== undefined)
					this.icon.class = options.icon.class
			}
			if (options.title !== undefined) this.title = options.title
			if (options.message !== undefined) this.message = options.message
		},
	},
})

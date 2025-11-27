declare global {
	interface Window {
		MissiveChat: {
			open: () => void
			close: () => void
			show: () => void
			showButton: () => void
			hide: () => void
			hideButton: () => void
			instance: any
		}
		MissiveChatConfig?: {
			id: string
			user?: {
				name?: string
				email?: string
			}
		}
	}
}

export {}

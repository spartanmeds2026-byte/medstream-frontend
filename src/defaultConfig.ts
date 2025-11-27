// Menu
import { headerMenu, accountMenu, bottomMenu } from "@/main/s9-menu"
export const defaultHeaderMenu = headerMenu
export const defaultAccountMenu = accountMenu
export const defaultBottomMenu = bottomMenu
export const defaultS9Router = true

export const defaultDevMode = import.meta.env.VITE_PROJECT_ENV === "dev"
export const defaultApiUrl = import.meta.env.VITE_PROJECT_API_URL

// Settings Theme
import { type Themes } from "./stores/theme"
export const defaultTheme: { name: Themes["name"]; layout: Themes["layout"] } =
	{
		name: "enigma",
		layout: "side-menu",
	}

export const defaultDarkMode = false
export const defaultColorScheme = "default"
export const defaultShowSettings = defaultDevMode

// Login And Permission
export const defaultLogin = import.meta.env.VITE_AUTH_MODE || "default"
export const defaultDisableLoginComponents = (
	import.meta.env.VITE_AUTH_DISABLE || ""
)
	.split("|")
	.map((item: string) => item.trim())
export const defaultPermission = true

// Avatar Image
export const defaultAvatar = {
	color: "ffffff",
	background: "00A8E8",
	"font-size": "0.5",
	bold: "true",
	size: "200",
}

// Marker.io
export const defaultMarkerIo = import.meta.env.VITE_MARKER_IO_PROJECT_ID
// MissiveLiveChat
export const defaultMissiveLiveChat = import.meta.env.VITE_MISSIVE_LIVE_CHAT

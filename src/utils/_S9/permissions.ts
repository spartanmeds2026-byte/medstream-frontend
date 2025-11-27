import { defaultPermission } from "@/defaultConfig"
import { AuthStore } from "@/stores"
import { useRouter } from "vue-router"
import { RolesAndPermissionsInterfaces } from "@/interfaces"
import { NotificationStore } from "@/stores"
import { type Menu as MenuItem } from "@/stores/menu"

const getPermissions = () => {
	const authStore = AuthStore.useStore()
	return authStore.getPermissions
}

export const hasPermissions = (pageName: string) => {
	if (!defaultPermission)
		return {
			list: true,
			create: true,
			read: true,
			update: true,
			del: true,
			export: true,
		}
	const permission = getPermissions()
	return (
		permission[pageName] || {
			list: false,
			create: false,
			read: false,
			update: false,
			del: false,
			export: false,
		}
	)
}

export const routerPermissions = ({
	permissionName,
	permissionRoute,
}: {
	permissionName?: keyof RolesAndPermissionsInterfaces.PermissionActions
	permissionRoute?: string
}) => {
	const router = useRouter()
	const routeName =
		permissionRoute || (router.currentRoute.value.name as string)
	const permission = hasPermissions(routeName)

	if (permissionName && !permission[permissionName]) {
		const notificationStore = NotificationStore.useStore()
		notificationStore.setNotification({
			title: "Error",
			message: `You don't have permission to ${routeName}`,
			icon: {
				name: "XCircle",
				class: "text-danger w-12 h-12",
			},
		})
		router.push({ name: "dashboard" })
	}

	return permission
}

export const hasMenuPermissions = (menu: MenuItem | "divider"): boolean => {
	if (menu === "divider") return true
	if (menu.force) return true
	if (menu.subMenu) {
		menu.subMenu = menu.subMenu.filter((subItem) => {
			if (subItem.force) return true

			if (subItem.subMenu) {
				return hasMenuPermissions(subItem)
			}

			const key = subItem.permission || subItem.pageName
			if (!key) return false

			const permission = hasPermissions(key)
			return permission.list !== false
		})

		if (menu.subMenu.length > 0) return true
	}

	const key = menu.permission || menu.pageName
	if (!key) return false

	const permission = hasPermissions(key)
	return permission.list !== false
}

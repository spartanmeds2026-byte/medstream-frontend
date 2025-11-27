import { type Menu } from "@/stores/menu"

export const headerMenu: Array<Menu | "divider"> = [
	{
		icon: "Home",
		pageName: "dashboard",
		title: "Dashboard",
	},
	{
		icon: "ShoppingCart",
		pageName: "products",
		title: "Products",
		permission: "products",
	},
	{
		icon: "Package",
		pageName: "categories",
		title: "Categories",
		permission: "categories",
	},
	{
		icon: "ReceiptIcon",
		pageName: "orders",
		title: "Orders",
		permission: "orders",
	},
	{
		icon: "Package",
		pageName: "purchase-history",
		title: "Purchase History",
		permission: "purchase_history",
	},
	"divider",
	{
		icon: "Users",
		pageName: "users",
		title: "Users",
	},
	{
		icon: "Package",
		pageName: "credit-apps",
		title: "Credit Apps",
		permission: "credit_apps",
	},
]

export const accountMenu: Array<Menu | "divider"> = [
	{
		icon: "User",
		pageName: "profile",
		title: "Profile",
	},
	"divider",
	{
		icon: "LogOut",
		pageName: "logout",
		title: "Logout",
	},
]

export const bottomMenu: Array<Menu | "divider"> = [
	// {
	// 	icon: "HelpCircle",
	// 	pageName: "blank",
	// 	title: "Support",
	// 	force: true,
	// },
]

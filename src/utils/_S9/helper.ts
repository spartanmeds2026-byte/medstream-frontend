import { defaultAvatar } from "@/defaultConfig"
import { NotificationStore, AuthStore } from "@/stores"
import {
	ApiInterfaces,
	FormioInterfaces,
	MessageInterfaces,
} from "@/interfaces"
import { AxiosError } from "axios"
import moment from "moment"
import Glider from "glider-js"

export const responseDefaultError = (error: AxiosError | string): void => {
	const notificationStore = NotificationStore.useStore()

	if (typeof error === "string") {
		const message =
			MessageInterfaces.Message[
				error as keyof typeof MessageInterfaces.Message
			] || error
		return notificationStore.setNotification({
			title: "Error",
			message: message,
			icon: {
				name: "XCircle",
				class: "text-danger w-12 h-12",
			},
		})
	}

	const { code = 500, data = "Unknown error" } =
		(error.response?.data as ApiInterfaces.Response<string>) || {}

	if (code == 401) {
		responseDefaultError("unauthorized")
		AuthStore.useStore().logout()
		return
	}

	if (code == 403) {
		responseDefaultError("forbidden")
		return
	}

	if (code == 500) {
		responseDefaultError("error")
		return
	}

	return notificationStore.setNotification({
		title: "Error",
		message: data,
		icon: {
			name: "XCircle",
			class: "text-danger w-12 h-12",
		},
	})
}

const getSuccessMessage = (
	status?: keyof typeof MessageInterfaces.Message | string
): string => {
	if (!status) return MessageInterfaces.Message.saved

	return status in MessageInterfaces.Message
		? MessageInterfaces.Message[
				status as keyof typeof MessageInterfaces.Message
			]
		: status
}

export const responseDefaultSuccess = (
	status?: keyof typeof MessageInterfaces.Message | string
): void => {
	const message = getSuccessMessage(status)
	const notificationStore = NotificationStore.useStore()

	notificationStore.setNotification({
		title: "Success",
		message,
		icon: {
			name: "CheckCircle",
			class: "text-success w-12 h-12",
		},
	})
}

export const avatarPreview = (value: string): string => {
	if (value?.includes("http") || value?.includes(".com")) return value
	const params = new URLSearchParams()
	params.set("name", value)
	for (const [key, value] of Object.entries(defaultAvatar)) {
		params.set(key, value)
	}
	return "https://ui-avatars.com/api/?" + params.toString()
}

// Format Humanized date and time in moment
export const formatHumanizedDate = (
	value: Date | string | null | undefined
): string => {
	if (!value) return ""
	moment.locale()
	return moment(value).fromNow()
}

export const formatDate = (value: Date | string | null | undefined): string => {
	if (!value) return ""

	const lang = "en-US" //|| navigator.language
	const options: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "UTC",
	}

	if (typeof value === "string") {
		value = new Date(value)
	}

	return new Intl.DateTimeFormat(lang, options).format(value)
}

export const formatCurrency = (value: number): string => {
	if (!value) value = 0
	const lang = "en-US" //|| navigator.language
	const options: Intl.NumberFormatOptions = {
		style: "currency",
		currency: "USD",
	}
	return new Intl.NumberFormat(lang, options).format(value)
}

export const groupByFormio = (
	items: FormioInterfaces.FormioItem[],
	key: string,
	defaultStage: string
): Record<string, FormioInterfaces.FormioItem[]> => {
	return items.reduce(
		(
			result: Record<string, FormioInterfaces.FormioItem[]>,
			item: FormioInterfaces.FormioItem
		) => {
			const itemKey = item.data[key] ?? defaultStage
			if (!result[itemKey]) {
				result[itemKey] = []
			}
			result[itemKey].push(item)
			return result
		},
		{}
	)
}

export const arrayToObject = <T>(arr: T[], key: keyof T, value: keyof T) =>
	arr.reduce(
		(obj, item) => {
			obj[String(item[key])] = item[value]
			return obj
		},
		{} as { [key: string]: any }
	)

export const removeDuplicates = (records: any[], key: string) => {
	const seen = new Set()

	return records.filter((record) => {
		const duplicate = seen.has(record[key])
		seen.add(record[key])
		return !duplicate
	})
}

export const findInArray = <T>(
	arr: T[],
	key: keyof T,
	value: any
): T | undefined => {
	return arr.find((item) => item[key] === value)
}

export const initSliderGallery = (
	selector = ".photo-gallery label ~ div:not([class])"
) => {
	setTimeout(() => {
		Array.from(document.querySelectorAll(selector)).map((element: any) => {
			new Glider(element, {
				slidesToShow: 2.3,
				slidesToScroll: 2,
				draggable: true,
				responsive: [
					{
						breakpoint: 1900,
						settings: {
							slidesToShow: 4.2,
							slidesToScroll: 4,
						},
					},
					{
						breakpoint: 1800,
						settings: {
							slidesToShow: 3.3,
							slidesToScroll: 3,
						},
					},
					{
						breakpoint: 1400,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3,
						},
					},
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 2.3,
							slidesToScroll: 2,
						},
					},
					{
						breakpoint: 640,
						settings: {
							slidesToShow: 2.3,
							slidesToScroll: 2,
						},
					},
					{
						breakpoint: 100,
						settings: {
							slidesToShow: 2.1,
							slidesToScroll: 2,
						},
					},
				],
			})
		})
	}, 500)
}

export const copyToClipboard = async (text: string) => {
	if (!text) return
	const notificationStore = NotificationStore.useStore()
	navigator.clipboard
		.writeText(text)
		.then(() => {
			notificationStore.setNotification({
				title: "Copy",
				message: "Copied to Clipboard",
				icon: {
					name: "CopyCheck",
					class: "text-success w-8 h-8",
				},
			})
		})
		.catch(() => {
			notificationStore.setNotification({
				title: "Copy",
				message: "Copied failed",
				icon: {
					name: "CopyX",
					class: "text-red-500 w-8 h-8",
				},
			})
		})
}

export const getEnumLabel = <T extends Record<string, string>>(
	status: string | undefined,
	statusEnum: T
): string => {
	if (status && Object.keys(statusEnum).includes(status)) {
		return statusEnum[status as keyof T]
	}
	return status || ""
}

export const loadScript = (src: string, props?: any): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			document.querySelector(`script[src="${src}"]`)?.remove()
		}

		const script = document.createElement("script")
		for (const [key, value] of Object.entries(props)) {
			script.setAttribute(key, value as string)
		}

		script.src = src
		script.onload = () => resolve()
		script.onerror = () => reject(new Error(`Error load script: ${src}`))
		document.body.appendChild(script)
	})
}

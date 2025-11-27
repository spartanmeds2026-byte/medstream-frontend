import axios, { AxiosResponse, AxiosError } from "axios"

axios.defaults.withCredentials = true

axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (
			(error.response?.status === 401 ||
				error.message.includes("Network Error")) &&
			!window.location.pathname.startsWith("/login") &&
			!window.location.pathname.startsWith("/logout")
		) {
			localStorage.clear()
			window.location.href = "/login"
		}
		return Promise.reject(error)
	}
)

export type { AxiosResponse, AxiosError }
export { axios }

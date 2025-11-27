import router from "@/router"
import { defineStore } from "pinia"
import { avatarPreview } from "@/utils/_S9/helper"
import { AuthApi, ProfileApi } from "@/api"

import {
	UserInterfaces,
	RolesAndPermissionsInterfaces,
	AuthInterfaces,
} from "@/interfaces"

interface AuthState {
	user: UserInterfaces.User | null
	profile: UserInterfaces.Profile | null
	permissions: RolesAndPermissionsInterfaces.PermissionMaps
	isAuthenticated: boolean
}

export const useStore = defineStore("auth", {
	state: (): AuthState => ({
		isAuthenticated: false,
		user: null,
		profile: null,
		permissions: {},
	}),
	getters: {
		getUserId: (state: AuthState): number | null => state.user?.id || null,
		getUser: (state: AuthState): UserInterfaces.User | null => state.user,
		getUserAvatar: (state: AuthState): string => {
			if (!state.user) return ""
			return (
				state.user.picture ||
				avatarPreview(`${state.user.first_name} ${state.user.last_name}`)
			)
		},
		getUserName: (state: AuthState): string => {
			if (state.user) {
				return `${state.user.first_name} ${state.user.last_name}`
			}
			return ""
		},
		getUserEmail: (state: AuthState): string => state.user?.email || "",
		getUserRole: (state: AuthState): string => {
			return state.user?.role?.name || ""
		},
		getIsAuthenticated: (state: AuthState): boolean => state.isAuthenticated,
		getPermissions: (
			state: AuthState
		): RolesAndPermissionsInterfaces.PermissionMaps => {
			return state.permissions
		},
		getIsSimulateLogin: (state: AuthState): boolean => {
			return state.user?.simulated || false
		},
		getCompanyDetail: (state: AuthState) => {
			return state.user?.company || null
		},
		getSalesRep: (state: AuthState) => {
			return state.user?.salesRep || null
		},
	},
	actions: {
		setUser(user: UserInterfaces.User): void {
			this.user = user
		},
		setAuthenticated(isAuthenticated: boolean): void {
			this.isAuthenticated = isAuthenticated
		},
		async loginPassword(credentials: {
			email: string
			password: string
		}): Promise<void> {
			try {
				const response: UserInterfaces.User =
					await AuthApi.loginPassword(credentials)
				this.setUser(response)
				this.setAuthenticated(true)
				this.initializeSession()
				router.push({ name: "dashboard" })
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},
		async loginCallbackStytch(
			credentials: AuthInterfaces.StytchCallBack
		): Promise<void> {
			try {
				const response = await AuthApi.loginCallbackStytch(credentials)
				this.setUser(response)
				this.setAuthenticated(true)
				this.initializeSession()
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},
		async loginVerifyCodeSMS(
			credentials: AuthInterfaces.StytchSMSVerify
		): Promise<void> {
			try {
				const response = await AuthApi.verifyCodeSMS(credentials)
				this.setUser(response)
				this.setAuthenticated(true)
				this.initializeSession()
				router.push({ name: "dashboard" })
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},
		async authCheck(): Promise<boolean> {
			try {
				const response = await ProfileApi.authCheck()
				this.setUser(response)
				this.setAuthenticated(true)
				await this.initializeSession()
				return true
			} catch (error) {
				console.error("Failed", error)
				this.logout()
				return false
			}
		},
		async logout(): Promise<void> {
			try {
				await AuthApi.logout()
			} catch (error) {
				console.error("Logout failed", error)
			}
			this.user = null
			this.isAuthenticated = false
			localStorage.clear()
			router.push({ name: "login" })
		},
		async initializeSession(): Promise<void> {
			try {
				const response = await ProfileApi.authPermissionsMap()
				this.permissions = response
			} catch (error) {
				console.error("Failed", error)
			}
		},
	},
	persist: {
		storage: localStorage,
	},
})

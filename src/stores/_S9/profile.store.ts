import { defineStore } from "pinia"
import { ProfileApi } from "@/api"
import { AuthStore } from "@/stores"
import { UserInterfaces } from "@/interfaces"

export const useStore = defineStore("profile", {
	actions: {
		async updateProfile(updateProfile: {
			first_name: string
			last_name: string
		}): Promise<void> {
			try {
				const response: UserInterfaces.User =
					await ProfileApi.updateProfile(updateProfile)
				AuthStore.useStore().setUser(response)
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},

		async updatePicture(updatePicture: { picture: string }): Promise<void> {
			try {
				const response: UserInterfaces.User =
					await ProfileApi.updateProfilePicture(updatePicture)
				AuthStore.useStore().setUser(response)
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},

		async updatePassword(updatePassword: {
			password: string
			new_password: string
			confirm_new_password: string
		}): Promise<void> {
			try {
				const response: UserInterfaces.User =
					await ProfileApi.updateProfilePassword(updatePassword)
				AuthStore.useStore().setUser(response)
			} catch (error) {
				console.error("Failed", error)
				throw error
			}
		},
	},
})

<script setup lang="ts">
import { UserInterfaces } from "@/interfaces"
import moment from "moment"

// Component
import { FormLabel } from "@/components/Base/Form"
import SkeletonForm from "./SkeletonForm.vue"

defineProps<{
	user: UserInterfaces.User | null
	isLoading: boolean
}>()
</script>

<template>
	<div class="validate-form">
		<template v-if="isLoading || !user">
			<SkeletonForm />
		</template>
		<template v-else>
			<div class="input-form">
				<FormLabel
					html-for="first-name"
					class="flex flex-col w-full sm:flex-row"
				>
					Name
				</FormLabel>
				{{ user.first_name }}
			</div>

			<div class="mt-3 input-form">
				<FormLabel html-for="email" class="flex flex-col w-full sm:flex-row">
					Email
				</FormLabel>
				{{ user.email }}
			</div>

			<div v-if="user.created_at" class="mt-3 input-form">
				<FormLabel
					html-for="created_at"
					class="flex flex-col w-full sm:flex-row"
				>
					Created At
				</FormLabel>
				{{ moment(user.created_at).format("YYYY-MM-DD HH:mm:ss") }}
			</div>

			<div v-if="user.updated_at" class="mt-3 input-form">
				<FormLabel
					html-for="updated_at"
					class="flex flex-col w-full sm:flex-row"
				>
					Updated At
				</FormLabel>
				{{ moment(user.updated_at).format("YYYY-MM-DD HH:mm:ss") }}
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, toRefs } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required, numeric } from "@vuelidate/validators"
import { ClientInterfaces } from "@/interfaces"
import { ClientApi } from "@/api"

// Component
import Button from "@/components/Base/Button"
import { FormLabel, FormSelect } from "@/components/Base/Form"
import SkeletonForm from "./SkeletonForm.vue"

const emit = defineEmits(["submitForm"])

defineProps<{
	formLoading: boolean
}>()

const isLoading = ref<boolean>(true)
const clients = ref<ClientInterfaces.Client[]>([])

const formData = reactive({
	customer_id: NaN,
})

const rules = {
	customer_id: {
		required,
		numeric,
	},
}

const validate = useVuelidate(rules, toRefs(formData))

const onSubmitForm = () => {
	validate.value.$touch()
	if (validate.value.$invalid) {
		responseDefaultError("form_check")
	} else {
		emit("submitForm", formData.customer_id)
	}
}

onBeforeMount(() => {
	isLoading.value = true
	ClientApi.getUnassignedClients()
		.then((response) => {
			clients.value = response
		})
		.finally(() => {
			isLoading.value = false
		})
})
</script>

<template>
	<!-- BEGIN: Validation Form -->
	<form class="validate-form" @submit.prevent="onSubmitForm">
		<template v-if="isLoading">
			<SkeletonForm />
		</template>
		<template v-else>
			<div class="input-form">
				<FormLabel
					html-for="customer_id"
					class="flex flex-col w-full sm:flex-row"
				>
					Customer
				</FormLabel>
				<FormSelect
					id="customer_id"
					v-model.trim="validate.customer_id.$model"
					name="customer_id"
					:class="{
						'border-danger': validate.customer_id.$error,
					}"
				>
					<option :value="NaN">Select Customer</option>
					<option v-for="client in clients" :key="client.id" :value="client.id">
						{{ client.name }}
					</option>
				</FormSelect>
				<template v-if="validate.customer_id.$error">
					<div
						v-for="(error, index) in validate.customer_id.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						{{ error.$message }}
					</div>
				</template>
			</div>

			<Button
				variant="primary"
				type="submit"
				class="mt-5"
				:disabled="formLoading"
			>
				Create
			</Button>
		</template>
	</form>
	<!-- END: Validation Form -->
</template>

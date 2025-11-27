<script setup lang="ts">
import { reactive, toRefs, watch } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { responseDefaultError } from "@/utils/_S9/helper"
import { required, minLength } from "@vuelidate/validators"

import Button from "@/components/Base/Button"
import { FormLabel, FormInput } from "@/components/Base/Form"
import Skeleton from "primevue/skeleton"

const props = defineProps<{
	isLoading: boolean
	formLoading: boolean
	formReset: boolean
}>()

const emit = defineEmits(["submitForm"])

const formData = reactive({
	first_name: "",
	last_name: "",
	address_1: "",
	address_2: "",
	city: "",
	state: "",
	country: "",
	zip: "",
})

const rules = {
	first_name: { required, minLength: minLength(2) },
	last_name: { required, minLength: minLength(2) },
	address_1: { required, minLength: minLength(4) },
	address_2: {},
	city: { required },
	state: { required },
	country: { required },
	zip: { required, minLength: minLength(4) },
}

const validate = useVuelidate(rules, toRefs(formData))

const onSubmitForm = () => {
	validate.value.$touch()
	if (validate.value.$invalid) {
		responseDefaultError("form_check")
	} else {
		emit("submitForm", { ...formData })
	}
}

const initForm = () => {
	formData.first_name = ""
	formData.last_name = ""
	formData.address_1 = ""
	formData.address_2 = ""
	formData.city = ""
	formData.state = ""
	formData.country = ""
	formData.zip = ""
}

watch(
	() => props.formReset,
	() => {
		initForm()
	}
)
</script>
<template>
	<form class="validate-form" @submit.prevent="onSubmitForm">
		<template v-if="isLoading">
			<div class="space-y-4">
				<!-- First Name + Last Name -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-36" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-36" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
				</div>

				<!-- Address 1 -->
				<div>
					<Skeleton height="1.3rem" class="mb-2 max-w-36" />
					<Skeleton height="2.5rem" class="w-full" />
				</div>

				<!-- Address 2 -->
				<div>
					<Skeleton height="1.3rem" class="mb-2 max-w-36" />
					<Skeleton height="2.5rem" class="w-full" />
				</div>

				<!-- City, State, Zip, Country -->
				<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-24" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-24" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-24" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
					<div>
						<Skeleton height="1.3rem" class="mb-2 max-w-24" />
						<Skeleton height="2.5rem" class="w-full" />
					</div>
				</div>

				<!-- Submit Button -->
				<div>
					<Skeleton height="2.5rem" width="6rem" class="mt-2" />
				</div>
			</div>
		</template>

		<template v-else>
			<!-- First Row: First Name + Last Name -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<FormLabel html-for="first_name">First Name</FormLabel>
					<FormInput
						id="first_name"
						v-model.trim="validate.first_name.$model"
						type="text"
						name="first_name"
						placeholder="First Name"
						:class="{ 'border-danger': validate.first_name.$error }"
					/>
					<template v-if="validate.first_name.$error">
						<div
							v-for="(error, index) in validate.first_name.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div>
					<FormLabel html-for="last_name">Last Name</FormLabel>
					<FormInput
						id="last_name"
						v-model.trim="validate.last_name.$model"
						type="text"
						name="last_name"
						placeholder="Last Name"
						:class="{ 'border-danger': validate.last_name.$error }"
					/>
					<template v-if="validate.last_name.$error">
						<div
							v-for="(error, index) in validate.last_name.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>
			</div>

			<!-- Address 1 -->
			<div class="mt-4">
				<FormLabel html-for="address_1">Address 1</FormLabel>
				<FormInput
					id="address_1"
					v-model.trim="validate.address_1.$model"
					type="text"
					name="address_1"
					placeholder="Address 1"
					:class="{ 'border-danger': validate.address_1.$error }"
				/>
				<template v-if="validate.address_1.$error">
					<div
						v-for="(error, index) in validate.address_1.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						<span class="uppercase">{{ error.$property }}</span>
						{{ error.$message }}
					</div>
				</template>
			</div>

			<!-- Address 2 -->
			<div class="mt-4">
				<FormLabel html-for="address_2">Address 2</FormLabel>
				<FormInput
					id="address_2"
					v-model.trim="validate.address_2.$model"
					type="text"
					name="address_2"
					placeholder="Address 2"
					:class="{ 'border-danger': validate.address_2.$error }"
				/>
				<template v-if="validate.address_2.$error">
					<div
						v-for="(error, index) in validate.address_2.$errors"
						:key="index"
						class="mt-2 text-danger"
					>
						<span class="uppercase">{{ error.$property }}</span>
						{{ error.$message }}
					</div>
				</template>
			</div>

			<!-- City, State, Zip, Country -->
			<div class="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
				<div>
					<FormLabel html-for="city">City</FormLabel>
					<FormInput
						id="city"
						v-model.trim="validate.city.$model"
						type="text"
						name="city"
						placeholder="City"
						:class="{ 'border-danger': validate.city.$error }"
					/>
					<template v-if="validate.city.$error">
						<div
							v-for="(error, index) in validate.city.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div>
					<FormLabel html-for="state">State</FormLabel>
					<FormInput
						id="state"
						v-model.trim="validate.state.$model"
						type="text"
						name="state"
						placeholder="State"
						:class="{ 'border-danger': validate.state.$error }"
					/>
					<template v-if="validate.state.$error">
						<div
							v-for="(error, index) in validate.state.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div>
					<FormLabel html-for="zip">Zip</FormLabel>
					<FormInput
						id="zip"
						v-model.trim="validate.zip.$model"
						type="text"
						name="zip"
						placeholder="Zip"
						:class="{ 'border-danger': validate.zip.$error }"
					/>
					<template v-if="validate.zip.$error">
						<div
							v-for="(error, index) in validate.zip.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>

				<div>
					<FormLabel html-for="country">Country</FormLabel>
					<FormInput
						id="country"
						v-model.trim="validate.country.$model"
						type="text"
						name="country"
						placeholder="Country"
						:class="{ 'border-danger': validate.country.$error }"
					/>
					<template v-if="validate.country.$error">
						<div
							v-for="(error, index) in validate.country.$errors"
							:key="index"
							class="mt-2 text-danger"
						>
							<span class="uppercase">{{ error.$property }}</span>
							{{ error.$message }}
						</div>
					</template>
				</div>
			</div>

			<Button
				variant="primary"
				type="submit"
				class="mt-5"
				:disabled="formLoading"
			>
				Submit
			</Button>
		</template>
	</form>
</template>

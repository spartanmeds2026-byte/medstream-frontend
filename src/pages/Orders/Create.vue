<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ClientApi, FormioApi, OrderApi, UserApi, ProductApi } from "@/api"
import { FormioInterfaces, OrderInterfaces } from "@/interfaces"
import { AuthStore } from "@/stores"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import { addPropsToComponent } from "@/utils/_S9/formOptions"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"
import Dialog from "primevue/dialog"
import ModalAddAddress from "./partials/ModalAddAddress.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsOrder = routerPermissions({
	permissionRoute: "orders",
	permissionName: "create",
})

const authStore = AuthStore.useStore()
const route = useRoute()
const router = useRouter()
const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgorderv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formState = ref<string>()
const formReset = ref<boolean>(false)

const highlightQuantityField = () => {
	setTimeout(() => {
		if (!formInstance.value?.formio?.instance) return

		const dataGridComponent =
			formInstance.value.formio.instance.getComponent("dataGrid")
		if (!dataGridComponent) return

		const rows = dataGridComponent.rows
		if (rows.length === 0) return

		const lastRow = rows[rows.length - 1]

		const quantityComponent = lastRow.quantity
		if (quantityComponent) {
			const inputElement = quantityComponent.element?.querySelector("input")
			if (inputElement) {
				inputElement.classList.add("highlight-quantity")
				inputElement.style.backgroundColor = "#fff3cd"
				inputElement.style.borderColor = "#ffc107"
				inputElement.style.boxShadow = "0 0 0 0.2rem rgba(255, 193, 7, 0.25)"

				inputElement.focus()
				inputElement.select()

				setTimeout(() => {
					inputElement.classList.remove("highlight-quantity")
					inputElement.style.backgroundColor = ""
					inputElement.style.borderColor = ""
					inputElement.style.boxShadow = ""
				}, 3000)
			}
		}
	}, 1500)
}

const onExternalSubmit = ref(false)

const onSubmitDraftForm = () => {
	if (!permissionsOrder.create) return
	formState.value = "draft"
	onExternalSubmit.value = !onExternalSubmit.value
}

const onSubmitOrderForm = () => {
	if (!permissionsOrder.create) return
	formState.value = undefined
	onExternalSubmit.value = !onExternalSubmit.value
}

const onSubmitForm = (submission: OrderInterfaces.Order) => {
	if (!permissionsOrder.create) return
	formLoading.value = true
	OrderApi.createOrder(submission, formState.value)
		.then(() => {
			responseDefaultSuccess("created")
			router.push({ name: "orders" })
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

const handleFormModal = (formEvent: any) => {
	if (formEvent.component.key === "addAddress") {
		modalAddAddress.value = true
	}
}

const modalAddAddress = ref(false)
const addAddress = (submission: any) => {
	if (!permissionsOrder.create) return
	formLoading.value = true
	UserApi.createAddressByCustomer(submission)
		.then((response) => {
			responseDefaultSuccess("created")
			formReset.value = !formReset.value

			const component = formInstance.value.formio.instance.getComponent(
				"shippingAddressSelector"
			)
			component.setValue(response)
			component.redraw()

			modalAddAddress.value = false
		})
		.catch((error) => responseDefaultError(error))
		.finally(() => {
			formLoading.value = false
		})
}

onBeforeMount(async () => {
	try {
		if (!authStore.getUser?.id) return
		isLoading.value = true
		const [ApiJson] = await Promise.all([FormioApi.getFormJson(formUrl)])

		let processedFormJson = ApiJson

		if (authStore.getUser?.is_admin) {
			processedFormJson = ApiJson
		} else {
			const client = await ClientApi.getClientByUserId(authStore.getUser.id)
			processedFormJson = addPropsToComponent(ApiJson, "customer1", {
				defaultValue: client,
				disabled: true,
			})
		}

		if (route.query.productId) {
			try {
				const productId = Number.parseInt(route.query.productId as string, 10)
				const product = await ProductApi.getProductById(productId)

				const productData = {
					product: product,
					quantity: 1,
					price: product.customer_price || product.default_price || 0,
					total: product.customer_price || product.default_price || 0,
				}

				processedFormJson = addPropsToComponent(processedFormJson, "dataGrid", {
					defaultValue: [productData],
				})

				if (route.query.highlightQuantity === "true") {
					highlightQuantityField()
				}
			} catch (error) {
				console.error("Error getting product data:", error)
			}
		}

		formJson.value = processedFormJson
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoading.value = false
	}
})
</script>

<template>
	<div
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Create Order</h2>
		<Button
			class="min-w-20"
			variant="primary"
			@click="() => onSubmitDraftForm()"
		>
			Save a Draft
		</Button>
		<Button
			class="min-w-20"
			variant="primary"
			@click="() => onSubmitOrderForm()"
		>
			Submit Order
		</Button>
	</div>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="col-span-12">
			<Formio
				ref="formInstance"
				full-width
				:form="formJson"
				:url="formUrl"
				:form-loading="formLoading"
				:is-loading="isLoading"
				:ext-submit="onExternalSubmit"
				@submit="onSubmitForm"
				@modal="handleFormModal"
			/>
		</div>
	</div>

	<!-- Modal: Add Address -->
	<Dialog
		v-model:visible="modalAddAddress"
		header="Add Address"
		class="sm:max-w-[90vw]"
		maximizable
		modal
	>
		<ModalAddAddress
			:form-loading="formLoading"
			:form-reset="formReset"
			:is-loading="isLoading"
			@submit-form="addAddress"
		/>
	</Dialog>
</template>

<style scoped>
:deep(.highlight-quantity) {
	animation: highlightPulse 2s ease-in-out;
}

@keyframes highlightPulse {
	0% {
		background-color: #fff3cd;
		border-color: #ffc107;
		box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
	}
	50% {
		background-color: #ffeaa7;
		border-color: #fdcb6e;
		box-shadow: 0 0 0 0.3rem rgba(255, 193, 7, 0.4);
	}
	100% {
		background-color: #fff3cd;
		border-color: #ffc107;
		box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
	}
}
</style>

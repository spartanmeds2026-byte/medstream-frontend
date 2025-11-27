<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FormioApi, OrderApi, ProductApi } from "@/api"
import { FormioInterfaces, OrderInterfaces } from "@/interfaces"
import {
	responseDefaultSuccess,
	responseDefaultError,
} from "@/utils/_S9/helper"
import { addPropsToComponent } from "@/utils/_S9/formOptions"

// Component
import Formio from "@/components/_S9/Formio.vue"
import Button from "@/components/Base/Button"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsOrder = routerPermissions({
	permissionRoute: "orders",
	permissionName: "update",
})

const route = useRoute()
const router = useRouter()
const orderId = Number.parseInt(route.params.orderId as string, 10)

const isLoading = ref<boolean>(true)
const formLoading = ref<boolean>(false)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgorderv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formSubmission = ref<OrderInterfaces.Order | null>(null)
const formState = ref<string>()

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

const getOrder = () => {
	return OrderApi.getOrderById(orderId).then((response) => {
		formSubmission.value = response
	})
}

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

const onSubmitForm = (order: OrderInterfaces.Order) => {
	if (!permissionsOrder.update) return
	formLoading.value = true
	OrderApi.updateOrder(orderId, order, formState.value)
		.then((response) => {
			formSubmission.value = response
			responseDefaultSuccess("updated")
			router.push({ name: "order", params: { orderId } })
		})
		.catch((error) => {
			responseDefaultError(error)
		})
		.finally(() => {
			formLoading.value = false
		})
}

const onExternalSubmit = ref(false)

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
			getOrder(),
		])

		let processedFormJson = addPropsToComponent(ApiJson, "customer1", {
			disabled: true,
		})

		if (route.query.productId && formSubmission.value) {
			try {
				const productId = Number.parseInt(route.query.productId as string, 10)
				const product = await ProductApi.getProductById(productId)

				const productData = {
					product: product,
					quantity: 1,
					price: product.customer_price || product.default_price || 0,
					total: product.customer_price || product.default_price || 0,
				}

				const currentDataGrid = formSubmission.value.data?.dataGrid || []
				const updatedDataGrid = [...currentDataGrid, productData]

				formSubmission.value = {
					...formSubmission.value,
					data: {
						...formSubmission.value.data,
						dataGrid: updatedDataGrid,
					},
				}

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
		<h2 class="mr-auto text-lg font-medium">
			Edit Order
			<span
				v-if="formSubmission?.state && formSubmission.state != 'sale'"
				class="text-sm text-gray-500"
			>
				({{ formSubmission?.state }})
			</span>
		</h2>

		<Button
			v-if="formSubmission?.state && formSubmission.state === 'draft'"
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
			Save Order
		</Button>
	</div>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="col-span-12">
			<Formio
				ref="formInstance"
				full-width
				:form="formJson"
				:url="formUrl"
				:submission="{ data: formSubmission?.data }"
				:is-loading="isLoading"
				:form-loading="formLoading"
				:ext-submit="onExternalSubmit"
				@submit="onSubmitForm"
			/>
		</div>
	</div>
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

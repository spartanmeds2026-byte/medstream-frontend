<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute, useRouter } from "vue-router"
import { FormioApi, ProductApi, OrderApi, ClientApi } from "@/api"
import {
	FormioInterfaces,
	ProductInterfaces,
	OrderInterfaces,
} from "@/interfaces"
import {
	responseDefaultError,
	responseDefaultSuccess,
} from "@/utils/_S9/helper"
import { ThemeStore } from "@/stores"

// Component
import Formio from "@/components/_S9/Formio.vue"
import TableListLogOrder from "./partials/TableListLogOrder.vue"
import Button from "@/components/Base/Button"
import Dialog from "primevue/dialog"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
const permissionsProduct = routerPermissions({
	permissionRoute: "products",
	permissionName: "read",
})

const route = useRoute()
const router = useRouter()
const productId = Number.parseInt(route.params.productId as string, 10)
const themeStore = ThemeStore.useStore()

const isLoading = ref<boolean>(true)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgproductsv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formSubmission = ref<ProductInterfaces.Product | null>(null)

const getProduct = () => {
	return ProductApi.getProductById(productId).then((response) => {
		formSubmission.value = response
	})
}

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
			getProduct(),
		])

		const breadcrumb = {
			router: "product",
			titles: ["Product"],
		}
		if (formSubmission.value?.title)
			breadcrumb.titles.push(formSubmission.value?.title)

		themeStore.setBreadcrumb(breadcrumb)

		formJson.value = ApiJson
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoading.value = false
		getRecordsLogOrder()
	}
})

const formLoading = ref<boolean>(false)
const recordsLogOrder = ref<ProductInterfaces.LogOrder[]>([])

const getRecordsLogOrder = async () => {
	try {
		formLoading.value = true

		const requests = [
			permissionsProduct.list
				? ProductApi.getLogOrdersByProductId(productId)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			recordsLogOrder.value = []
		} else {
			const response = results[0].value as ProductInterfaces.LogOrder[]
			recordsLogOrder.value = response
		}
	} catch (error) {
		responseDefaultError("error")
	} finally {
		formLoading.value = false
	}
}

const showDraftOrderModal = ref(false)
const draftOrders = ref<OrderInterfaces.Order[]>([])
const isLoadingDraftOrders = ref(false)

const getDraftOrders = async () => {
	try {
		isLoadingDraftOrders.value = true
		const response = await OrderApi.getDraftOrders()
		draftOrders.value = response.results
	} catch (error) {
		draftOrders.value = []
	} finally {
		isLoadingDraftOrders.value = false
	}
}

const handleAddToOrder = async () => {
	await getDraftOrders()
	showDraftOrderModal.value = true
}

const createNewDraftOrder = () => {
	showDraftOrderModal.value = false

	router.push({
		name: "order-create",
		query: {
			productId: productId.toString(),
			highlightQuantity: "true",
		},
	})
}

const addToExistingOrder = (orderId: number) => {
	showDraftOrderModal.value = false

	router.push({
		name: "order-edit",
		params: { orderId: orderId.toString() },
		query: {
			productId: productId.toString(),
			highlightQuantity: "true",
		},
	})
}
</script>

<template>
	<div
		v-if="permissionsProduct.list"
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">
			{{ formSubmission?.data.title }}
		</h2>
		<div class="ml-auto" />
		<Button
			v-if="permissionsProduct.create"
			variant="primary"
			class="shadow-md"
			@click="handleAddToOrder"
		>
			Add to Order
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
				view-render
				:is-loading="isLoading"
			/>
		</div>
	</div>

	<div
		v-if="permissionsProduct.list"
		class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap gap-2"
	>
		<h2 class="mr-auto text-lg font-medium">Order History</h2>
	</div>
	<div v-if="permissionsProduct.list" class="grid grid-cols-12 gap-6 mt-5">
		<TableListLogOrder
			:permissions="permissionsProduct"
			:records="recordsLogOrder"
			:is-loading="isLoading"
			:form-loading="formLoading"
		/>
	</div>

	<Dialog
		v-model:visible="showDraftOrderModal"
		header="Add to Existing Draft Order"
		class="sm:max-w-[90vw]"
		modal
	>
		<div class="space-y-4">
			<p class="text-sm text-gray-600">
				Draft orders found. Do you want to add this product to an existing order
				or create a new one?
			</p>

			<div v-if="isLoadingDraftOrders" class="text-center">
				<span>Loading draft orders...</span>
			</div>

			<div v-else-if="draftOrders.length > 0" class="space-y-2">
				<h4 class="font-medium">Draft orders available:</h4>
				<div
					v-for="order in draftOrders"
					:key="order.id"
					class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
					@click="addToExistingOrder(order.id!)"
				>
					<div class="flex justify-between items-center">
						<div>
							<span class="font-medium"
								>Orden #{{ order.order_number || order.id }}</span
							>
							<div class="text-sm text-gray-500">
								Customer: {{ order.data?.customer1?.name || "No customer" }}
							</div>
						</div>
						<div class="text-sm text-gray-500">
							{{
								order.created_at
									? new Date(order.created_at).toLocaleDateString()
									: ""
							}}
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-end space-x-2 pt-4">
				<Button
					variant="outline-secondary"
					@click="showDraftOrderModal = false"
				>
					Cancel
				</Button>
				<Button variant="primary" @click="createNewDraftOrder">
					Create New Order
				</Button>
			</div>
		</div>
	</Dialog>
</template>

<style>
.formio-component-textarea .card {
	min-height: 150px;
}
</style>

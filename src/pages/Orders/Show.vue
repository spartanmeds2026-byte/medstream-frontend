<script setup lang="ts">
import { ref, onBeforeMount } from "vue"
import { useRoute } from "vue-router"
import { FormioApi, OrderApi } from "@/api"
import { FormioInterfaces, OrderInterfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"
import { addPropsToComponent } from "@/utils/_S9/formOptions"

// Component
import Formio from "@/components/_S9/Formio.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
routerPermissions({
	permissionRoute: "orders",
	permissionName: "read",
})

const route = useRoute()
const orderId = Number.parseInt(route.params.orderId as string, 10)

const isLoading = ref<boolean>(true)
const formInstance = ref<any>(null)
const formUrl = "https://infraxio.form.io/msgorderv2"
const formJson = ref<FormioInterfaces.FormioJSON | undefined>(undefined)
const formSubmission = ref<OrderInterfaces.Order | null>(null)

const getOrder = () => {
	return OrderApi.getOrderById(orderId, { relations: ["odoo"] }).then(
		(response) => {
			formSubmission.value = response
		}
	)
}

onBeforeMount(async () => {
	try {
		isLoading.value = true
		const [ApiJson] = await Promise.all([
			FormioApi.getFormJson(formUrl),
			getOrder(),
		])

		formJson.value = addPropsToComponent(ApiJson, "shippingAddressSelector", {
			hidden: true,
		})
		formJson.value = addPropsToComponent(formJson.value, "addAddress", {
			hidden: true,
		})
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
			Order <span>#{{ formSubmission?.order_number }}</span>
		</h2>
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
</template>

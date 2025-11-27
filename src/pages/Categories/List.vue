<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import { useRouter } from "vue-router"
import { CategoryApi } from "@/api"
import { ApiInterfaces, CategoryInterfaces } from "@/interfaces"
import { responseDefaultError } from "@/utils/_S9/helper"

// Component
import Img from "@/components/_S9/Img.vue"

// Permission
import { routerPermissions } from "@/utils/_S9/permissions"
import Lucide from "@/components/Base/Lucide"
const permissionsCategorie = routerPermissions({
	permissionRoute: "categories",
	permissionName: "list",
})

const router = useRouter()
const isLoading = ref<boolean>(false)

const records = ref<CategoryInterfaces.Category[]>([])
const pagination = ref<ApiInterfaces.Meta>({
	sortField: "name",
	sortOrder: 1,
})

const getRecords = async () => {
	try {
		isLoading.value = true

		const requests = [
			permissionsCategorie.list
				? CategoryApi.getCategories(pagination.value)
				: Promise.resolve([]),
		]

		const results = await Promise.allSettled(requests)

		if (results[0].status !== "fulfilled") {
			records.value = []
		} else {
			const response = results[0]
				.value as ApiInterfaces.StructuredPagination<CategoryInterfaces.Category>
			records.value = response.results
		}
	} catch (error) {
		responseDefaultError("error")
	} finally {
		isLoading.value = false
	}
}

onBeforeMount(() => {
	getRecords()
})
</script>

<template>
	<div>
		<div
			class="mt-10 flex flex-wrap items-center col-span-12 intro-y sm:flex-nowrap"
		>
			<h2 class="text-lg font-medium">Categories</h2>
			<div class="ml-auto" />
		</div>

		<div
			class="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 mt-5"
		>
			<div
				v-for="category in records"
				:key="category.id"
				class="box flex flex-col group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-sm overflow-hidden"
				@click="
					() =>
						router.push({
							name: 'products',
							query: { categoryId: category.id },
						})
				"
			>
				<!-- Image Section -->
				<div
					class="relative min-h-48 h-48 sm:min-h-54 sm:h-54 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
				>
					<!-- Imagen de fondo con blur -->
					<Img
						:src="category.image || category.name"
						class="absolute inset-0 w-full h-full object-cover scale-110 blur-md opacity-60"
						aria-hidden="true"
					/>
					<!-- Imagen principal -->
					<Img
						:src="category.image || category.name"
						class="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 mask-image-gradient"
						style="
							mask-image: linear-gradient(
								to right,
								transparent 0%,
								black 20%,
								black 80%,
								transparent 100%
							);
						"
					/>

					<!-- Gradient Overlay -->
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					/>
				</div>

				<!-- Content Section -->
				<div class="px-4 pt-4 flex items-start justify-between mb-2 sm:mb-3">
					<h3
						class="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 leading-tight"
					>
						{{ category.name }}
					</h3>
				</div>

				<!-- Action Indicator -->
				<div class="px-4 pb-4 flex items-center justify-between mt-auto">
					<div
						class="flex items-center text-blue-600 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					>
						<span>View Products</span>
						<Lucide
							icon="ChevronRight"
							class="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-1 stroke-2 transform group-hover:translate-x-1 transition-transform duration-300"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

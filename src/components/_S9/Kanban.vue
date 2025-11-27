<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue"
import { FormioInterfaces } from "@/interfaces"
import { applyDrag, generateItems } from "@/utils/_S9/helperKanban"

// Component
import KanbanItem from "@/components/_S9/KanbanItem.vue"
import { Container } from "vue3-smooth-dnd"
import { responseDefaultError } from "@/utils/_S9/helper"

const props = withDefaults(
	defineProps<{
		stagesName: Record<string, string>
		stages: string[]
		records: Record<string, FormioInterfaces.FormioItem[]>
		changeStage: (item: FormioInterfaces.FormioItem, newStages: string) => void
	}>(),
	{}
)

const stagesName = computed(() => props.stagesName)
const stages = computed(() => props.stages)
const records = computed(() => props.records)

interface SceneItem {
	id: string
	type: string
	name: string
	props: SceneProps
	children: ChildrenItem[]
}

interface ChildrenItem extends SceneItem {
	loading: boolean
	error: boolean
	data: any
}

type SceneProps = {
	stages: string
	orientation: string
}

const KanbanScene = ref<SceneItem>({
	id: "root",
	type: "container",
	name: "Scene",
	props: {
		stages: "default",
		orientation: "horizontal",
	},
	children: [],
})

onBeforeMount(() => {
	KanbanScene.value.children = generateItems(
		stages.value.length,
		(i: number) => ({
			id: `column${i}`,
			type: "container",
			name: stagesName.value[stages.value[i]],
			props: {
				stages: stages.value[i],
				orientation: "vertical",
			},
			children: generateItems(
				records.value[stages.value[i]]?.length ?? 0,
				(j: number) => ({
					type: "draggable",
					id: `${i}${j}`,
					loading: false,
					error: false,
					data: records.value[stages.value[i]][j],
				})
			),
		})
	)
})

const handlerDrop = async (
	item: FormioInterfaces.FormioItem,
	newStages: string
) => {
	return await props.changeStage(item, newStages)
}

const onCardDrop = (columnId: string, dropResult: any) => {
	if (dropResult.removedIndex === null && dropResult.addedIndex === null) return
	const column = KanbanScene.value.children.find((p) => p.id === columnId)

	if (!column) return
	const itemIndex = KanbanScene.value.children.indexOf(column)
	const newColumn = { ...column }

	if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
		dropResult.payload.loading = true

		handlerDrop(dropResult.payload.data, newColumn.props.stages)
			.then(() => {
				dropResult.payload.loading = false
				dropResult.payload.error = false
			})
			.catch(() => {
				dropResult.payload.error = true
				responseDefaultError("error")
			})
	}

	newColumn.children = applyDrag(newColumn.children, dropResult)
	KanbanScene.value.children.splice(itemIndex, 1, newColumn)
}

const getCardPayload = (columnId: string) => (index: number) => {
	const column = KanbanScene.value.children.find((p) => p.id === columnId)
	return column?.children[index]
}
</script>

<template>
	<Container
		class="flex gap-4 pb-8 overflow-x-auto"
		group-name="cols"
		tag="div"
		orientation="horizontal"
	>
		<div
			v-for="column in KanbanScene.children"
			:key="column.id"
			class="flex-shrink-0 rounded-lg box min-h-64 w-64"
		>
			<div class="flex flex-col h-full">
				<!-- header -->
				<div class="flex px-4 py-2 text-white rounded-t-lg bg-primary">
					<span class="text-md text-test">{{ column.name }}</span>
				</div>
				<!-- column -->
				<Container
					class="flex-grow overflow-x-hidden overflow-y-auto"
					group-name="col-items"
					:should-accept-drop="
						(e: any, payload: any) =>
							e.groupName === 'col-items' && !payload.loading
					"
					:get-child-payload="getCardPayload(column.id)"
					:drop-placeholder="{
						className:
							'bg-primary bg-opacity-20 border-dotted border-2 border-primary rounded-lg mx-2 my-2',
						animationDuration: '200',
						showOnTop: true,
					}"
					drag-class="z-50 transition duration-100 ease-in transform scale-110 box border-gray-800 dark:border-gray-800 rotate-6"
					drop-class="z-50 transition duration-100 ease-in transform scale-90 -rotate-2"
					@drop="(e: any) => onCardDrop(column.id, e)"
				>
					<KanbanItem
						v-for="item in column.children"
						:key="item.id"
						:item="item"
					>
						<template #body>
							<slot name="KanbanItemBody" :item="item" />
						</template>
						<template #footer>
							<slot name="KanbanItemFooter" :item="item" />
						</template>
					</KanbanItem>
				</Container>
			</div>
		</div>
	</Container>
</template>

<style>
.smooth-dnd-container {
	scrollbar-color: #fff6 #00000026;
	scrollbar-width: auto;
}
.smooth-dnd-container.horizontal {
	display: flex !important;
}
</style>

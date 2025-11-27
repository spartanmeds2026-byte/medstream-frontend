<template>
	<Draggable v-if="item">
		<div
			class="overflow-hidden cursor-move mx-2 my-2 rounded-lg bg-gradient-to-b from-slate-200/30 to-slate-200/30 dark:from-darkmode-400 dark:to-darkmode-400 border-2 border-gray-200 hover:border-primary"
		>
			<div
				v-if="item.loading"
				:class="[
					'flex gap-2 items-center bg-primary text-white px-2 py-1',
					{
						'bg-primary': item.loading,
						'bg-red-700': item.error,
					},
				]"
			>
				<template v-if="item.error">
					<Lucide icon="AlertTriangleIcon" class="w-4 h-4" />
					Error while processing
				</template>
				<template v-else-if="item.loading">
					<LoadingIcon icon="grid" :color="'currentColor'" class="w-4 h-4" />
					Processing...
				</template>
			</div>
			<template v-if="$slots.body">
				<div class="p-2 space-y-1 leading-4 relative">
					<slot name="body" />
				</div>
			</template>
			<template v-if="$slots.footer">
				<div class="px-2 py-1 flex justify-start items-center bg-slate-500/30">
					<slot name="footer" />
				</div>
			</template>
		</div>
	</Draggable>
</template>

<script setup lang="ts">
import LoadingIcon from "@/components/Base/LoadingIcon"
import Lucide from "@/components/Base/Lucide"
import { Draggable } from "vue3-smooth-dnd"

withDefaults(
	defineProps<{
		item: any
	}>(),
	{}
)
</script>

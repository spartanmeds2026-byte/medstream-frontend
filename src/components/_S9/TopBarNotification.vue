<script lang="ts" setup>
import Lucide from "../Base/Lucide"
</script>
<template>
	<div class="mb-5 font-medium">Notifications</div>
	<div class="text-center">
		<Lucide icon="BellIcon" class="w-8 h-8 mx-auto" />
		<span class="font-bold">None</span>
	</div>
	<!-- <div
		v-for="(faker, fakerKey) in _.take(fakerData, 5)"
		:key="fakerKey"
		:class="['cursor-pointer relative flex items-center', { 'mt-5': fakerKey }]"
	>
		<div class="relative flex-none w-12 h-12 mr-1 image-fit">
			<img
				alt="Medstream Global Portal Tailwind HTML Admin Template"
				class="rounded-full"
				:src="faker.photos[0]"
			/>
			<div
				class="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"
			/>
		</div>
		<div class="ml-2 overflow-hidden">
			<div class="flex items-center">
				<a href="" class="mr-5 font-medium truncate">
					{{ faker.users[0].name }}
				</a>
				<div class="ml-auto text-xs text-slate-400 whitespace-nowrap">
					{{ faker.times[0] }}
				</div>
			</div>
			<div class="w-full truncate text-slate-500 mt-0.5">
				{{ faker.news[0].shortContent }}
			</div>
		</div>
	</div> -->
</template>

<script setup lang="ts">
import LoadingIcon from "@/components/Base/LoadingIcon"
</script>
<template>
	<div
		class="flex flex-col items-center justify-center col-span-6 sm:col-span-3 xl:col-span-2"
	>
		<LoadingIcon
			icon="grid"
			:color="'currentColor'"
			class="w-8 h-8 text-primary"
		/>
		<div class="mt-2 text-base text-center">
			Loading records data. Please wait.
		</div>
	</div>
</template>

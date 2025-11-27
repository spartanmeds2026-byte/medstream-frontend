<script setup lang="ts">
import Skeleton from "primevue/skeleton"
</script>
<template>
	<div class="validate-form">
		<div v-for="i in 4" :key="i" class="mt-3 first:mt-0">
			<Skeleton height="1.3rem" class="mb-3 max-w-36" />
			<Skeleton height="2.5rem" class="mb-3" />
		</div>
		<Skeleton height="2.5rem" width="5rem" class="mb-3" />
	</div>
</template>

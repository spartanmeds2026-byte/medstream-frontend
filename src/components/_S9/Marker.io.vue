<script setup lang="ts">
import { onMounted } from "vue"
import { defaultMarkerIo } from "@/defaultConfig"
import markerSDK from "@marker.io/browser"

onMounted(() => {
	if (!defaultMarkerIo) return
	markerSDK.loadWidget({
		project: defaultMarkerIo,
	})
})
</script>

<template>
	<div />
</template>

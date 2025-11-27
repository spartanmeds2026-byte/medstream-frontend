<script setup lang="ts">
import { onMounted } from "vue"
import { loadScript } from "@/utils/_S9/helper"

onMounted(async () => {
	try {
		await loadScript("https://pait.odoo.com/im_livechat/loader/2", {
			defer: "",
		})
		await loadScript("https://pait.odoo.com/im_livechat/assets_embed.js", {
			defer: "",
		})
	} catch (error) {
		console.error(error)
	}
})
</script>

<template>
	<div>
		<!-- Live Chat Odoo -->
	</div>
</template>

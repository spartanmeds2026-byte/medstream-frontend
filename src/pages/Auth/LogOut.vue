<script setup lang="ts">
import { AuthStore } from "@/stores"

const authStore = AuthStore.useStore()
authStore.logout()
</script>
<template><div /></template>

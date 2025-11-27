<script setup lang="ts">
import Lucide from "@/components/Base/Lucide"
defineProps<{
	email: string
}>()
</script>
<template>
	<div
		class="space-y-4 !fixed top-0 bottom-0 left-0 right-0 bg-white flex justify-center items-center flex-col !z-[999]"
	>
		<Lucide icon="MailIcon" class="intro-x text-theme-1 h-12 w-12 mx-auto" />
		<h2 class="intro-x text-2xl font-bold text-center">Confirm your email</h2>
		<p class="intro-x text-center text-slate-400">
			We emailed your magic link to {{ email }}.
			<br />
			Click on the link to log in or sign up.
		</p>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ThemeStore } from "@/stores"

// Components
import ThemeSwitcher from "@/components/ThemeSwitcher"
import LoginForm from "@/pages/Auth/Login/LoginForm.vue"
import CompanyLogo from "@/components/_S9/CompanyLogo.vue"

const defaultCompany = computed(() => ThemeStore.useStore().getCompanyDetail)
</script>

<template>
	<div
		:style="`--banner-login: url(${defaultCompany.bannerLogin})`"
		:class="[
			'overflow-hidden p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
			'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary before:rounded-[100%] before:dark:bg-primary',
			`after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] bg-banner-login after:bg-no-repeat after:bg-cover after:bg-center after:rounded-[100%] after:dark:bg-darkmode-700`,
		]"
	>
		<ThemeSwitcher />
		<div class="container relative z-10 sm:px-10">
			<div class="block grid-cols-2 gap-4 xl:grid">
				<!-- BEGIN: Login Info -->
				<div class="flex-col hidden min-h-screen xl:flex">
					<a href="" class="flex items-center pt-5 -intro-x text-white">
						<CompanyLogo class="w-auto max-h-48 max-w-96" />
					</a>
					<div class="my-auto" />
				</div>
				<!-- END: Login Info -->
				<!-- BEGIN: Login Form -->
				<div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
					<div
						class="text-center w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md dark:bg-darkmode-600 xl:bg-transparent xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto max-w-md overflow-hidden xl:overflow-visible"
					>
						<LoginForm />
					</div>
				</div>
				<!-- END: Login Form -->
			</div>
		</div>
	</div>
</template>

<style scoped>
.bg-banner-login::after {
	background-image: linear-gradient(to bottom, rgba(0 0 0) 20%, transparent 45%),
		var(--banner-login);
	opacity: 1;
}
</style>

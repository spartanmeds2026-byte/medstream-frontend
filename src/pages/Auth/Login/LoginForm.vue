<script setup lang="ts">
import { ThemeStore } from "@/stores"
import * as lucideIcons from "lucide-vue-next"
import { type Component, computed, ref } from "vue"
import { defaultDisableLoginComponents, defaultLogin } from "@/defaultConfig"

// Icons
type Icon = keyof typeof lucideIcons
import StytchIcon from "@/assets/images/icon/stytch.svg"
import GoogleIcon from "@/assets/images/icon/google.svg"
import AppleIcon from "@/assets/images/icon/apple.svg"
import TwitterIcon from "@/assets/images/icon/twitter.svg"
import MetaIcon from "@/assets/images/icon/meta.svg"
import MicrosoftIcon from "@/assets/images/icon/microsoft.svg"

// Components
import Button from "@/components/Base/Button"
import Lucide from "@/components/Base/Lucide"
import Divider from "@/components/Base/Headless/Menu/Divider.vue"
import StytchForm from "@/pages/Auth/Login/Stytch/StytchForm.vue"
import StytchSMSForm from "@/pages/Auth/Login/Stytch/StytchSMSForm.vue"
import DefaultForm from "@/pages/Auth/Login/Default/DefaultForm.vue"

interface LoginButton {
	icon: string | Component
	text: string
	showForm: ReturnType<typeof ref<boolean>>
	component: typeof StytchForm | typeof DefaultForm | typeof StytchSMSForm
}

const defaultCompany = computed(() => ThemeStore.useStore().getCompanyDetail)
const ButtonsWithLogin: Record<string, LoginButton> = {
	stytch: {
		icon: StytchIcon,
		text: "Continue with Passwordless",
		showForm: ref(false),
		component: StytchForm,
	},
	password: {
		icon: "KeyRoundIcon",
		text: "Continue with Password",
		showForm: ref(false),
		component: DefaultForm,
	},
	sms: {
		icon: "Smartphone",
		text: "Continue with SMS",
		showForm: ref(false),
		component: StytchSMSForm,
	},
}

const SSO_DISPLAY = (import.meta.env.VITE_SSO_SOCIAL || "")
	.split("|")
	.map((item: string) => item.trim())

const buildUrl = (social: string) => {
	if (!import.meta.env.VITE_SSO_TOKEN) return ""
	if (!SSO_DISPLAY.includes(social)) return ""
	return `${import.meta.env.VITE_SSO_URL}/${social}/start?public_token=${import.meta.env.VITE_SSO_TOKEN}&login_redirect_url=${defaultCompany.value.url}${import.meta.env.VITE_SSO_REDIRECT_URL}`
}

const SSO = {
	Google: {
		icon: GoogleIcon,
		url: buildUrl("google"),
	},
	Apple: {
		icon: AppleIcon,
		url: buildUrl("apple"),
	},
	Twitter: {
		icon: TwitterIcon,
		url: buildUrl("twitter"),
	},
	Meta: {
		icon: MetaIcon,
		url: buildUrl("facebook"),
	},
	Microsoft: {
		icon: MicrosoftIcon,
		url: buildUrl("microsoft"),
	},
}

const initSSO = Object.values(SSO).some((item) => !!item.url)
const otherLogins = computed(() =>
	Object.values(ButtonsWithLogin).some((item) => item.showForm.value)
)
const fullScreen = ref(false)

const selectLogin = (select: keyof typeof ButtonsWithLogin) => {
	for (const key in ButtonsWithLogin) {
		ButtonsWithLogin[key as keyof typeof ButtonsWithLogin].showForm.value =
			key == select ? true : false
	}
}

const initForm = () => {
	for (const key in ButtonsWithLogin) {
		ButtonsWithLogin[key as keyof typeof ButtonsWithLogin].showForm.value =
			false
	}
}
</script>

<template>
	<h2 class="text-2xl font-bold intro-x xl:text-3xl text-pretty">
		Log in to {{ defaultCompany.title }}
	</h2>
	<div class="mt-2 text-center intro-x text-slate-400">
		A few more clicks to sign in to your account. Manage all your e-commerce
		accounts in one place
	</div>
	<template v-if="defaultLogin == 'default'">
		<div :class="[fullScreen ? 'mt-8' : 'mt-8 intro-x space-y-2']">
			<template v-for="(item, index) in ButtonsWithLogin" :key="index">
				<Button
					v-if="!defaultDisableLoginComponents.includes(index)"
					v-show="!otherLogins"
					variant="primary"
					class="w-full text-base py-3"
					@click="selectLogin(index)"
				>
					<template v-if="typeof item.icon == 'string'">
						<Lucide :icon="item.icon as Icon" class="w-5 h-5 mr-2" />
					</template>
					<template v-else>
						<component :is="item.icon" class="w-5 h-5 mr-2" />
					</template>
					{{ item.text }}
				</Button>

				<template v-if="item.showForm.value">
					<component
						:is="item.component"
						@full-screen="() => (fullScreen = true)"
					/>
				</template>
			</template>
		</div>
		<template v-if="otherLogins">
			<Button
				variant="outline-secondary"
				class="w-full px-4 py-3 mt-4 intro-x"
				@click="initForm"
			>
				<Lucide icon="ArrowLeft" class="w-5 h-5 mr-2" />
				Other Login options
			</Button>
		</template>
	</template>
	<template v-else>
		<component
			:is="
				ButtonsWithLogin[defaultLogin as keyof typeof ButtonsWithLogin]
					.component
			"
			@full-screen="() => (fullScreen = true)"
		/>
	</template>

	<!-- SSO -->
	<template v-if="initSSO && !otherLogins">
		<!-- Divider -->
		<div class="intro-x relative !my-6">
			<Divider class="absolute inset-0 flex items-center" />
			<div class="relative flex justify-center uppercase">
				<span
					class="bg-white dark:bg-darkmode-600 px-2 text-center intro-x text-slate-400"
				>
					Or
					<span>continue with</span>
				</span>
			</div>
		</div>

		<div class="intro-x flex flex-wrap justify-center space-x-2">
			<Button
				v-for="item in Object.values(SSO)"
				v-show="item.url"
				:key="item.url"
				as="a"
				:href="item.url"
				variant="outline-secondary"
				class="rounded-full h-10 w-10 p-2 hover:text-primary hover:dark:text-primary"
			>
				<component :is="item.icon" class="w-5 h-5" />
			</Button>
		</div>
	</template>

	<!-- Register -->
	<div class="mt-5 intro-x xl:mt-8 hidden">
		<Button variant="outline-secondary" class="w-full px-4 py-3">
			Register
			<Lucide icon="ArrowRight" class="w-5 h-5 ml-2" />
		</Button>
	</div>

	<!-- Terms and Conditions -->
	<div class="mt-8 intro-x text-slate-600 dark:text-slate-500">
		By signin up, you agree to our <br />
		<a
			class="text-primary dark:text-slate-200"
			target="_blank"
			href="https://www.medstreamglobal.com/terms-and-conditions"
		>
			Terms and Conditions
		</a>
		&
		<a
			class="text-primary dark:text-slate-200"
			target="_blank"
			href="https://www.medstreamglobal.com/privacy"
		>
			Privacy Policy
		</a>
	</div>
</template>

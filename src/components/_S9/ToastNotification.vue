<script setup lang="ts">
import { watch, ref, provide } from "vue"

import Lucide from "@/components/Base/Lucide"
import Notification from "@/components/Base/Notification"
import { type NotificationElement } from "@/components/Base/Notification"
import { type Options } from "toastify-js"

import { NotificationStore } from "@/stores"
const notificationStore = NotificationStore.useStore()

const options: Options = {
	duration: 2000,
	newWindow: true,
	close: true,
	gravity: "bottom",
	position: "right",
	stopOnFocus: true,
}

const notificationContent = ref<NotificationElement>()
const notificationContentToggle = () => {
	notificationContent.value?.showToast()
}
provide("bind[notificationContent]", (el: NotificationElement) => {
	notificationContent.value = el
})

watch(notificationStore.getNotification, (newValue) => {
	if (newValue.title || newValue.message) notificationContentToggle()
})
</script>
<template>
	<!-- BEGIN: Success Notification Content -->
	<Notification
		ref-key="notificationContent"
		class="flex hidden"
		:options="options"
	>
		<Lucide
			:icon="notificationStore.getIconName"
			:class="notificationStore.getIconClass"
		/>
		<div class="ml-4 mr-4">
			<div class="font-medium">
				{{ notificationStore.getTitle }}
			</div>
			<div class="mt-1 text-slate-500">
				<template v-if="typeof notificationStore.getMessage === 'string'">
					{{ notificationStore.getMessage }}
				</template>
				<template v-else>
					<ul>
						<li
							v-for="(messageArray, index) in notificationStore.getMessage"
							:key="index"
						>
							<span
								v-for="(item, i) in Object.values(messageArray)"
								:key="i"
								class="mr-1"
							>
								<template v-if="i === 0">
									<span class="uppercase"> "{{ item }}" </span>
								</template>
								<template v-else>
									<span> {{ item }} </span>
								</template>
							</span>
						</li>
					</ul>
				</template>
			</div>
		</div>
	</Notification>
	<!-- END: Success Notification Content -->
</template>

<script setup>
// Components
import ConfirmDialog from "primevue/confirmdialog"
import Button from "primevue/button"
</script>
<template>
	<ConfirmDialog group="headlessConfirmItem">
		<template #container="{ message, acceptCallback, rejectCallback }">
			<div
				class="flex flex-col items-center p-5 bg-surface-0 dark:bg-surface-700 rounded-md"
			>
				<div
					class="rounded-full bg-primary-500 dark:bg-primary-400 text-surface-0 dark:text-surface-900 inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-[3rem]"
				>
					<i class="pi pi-question text-5xl" />
				</div>
				<span class="font-bold text-2xl block mb-2 mt-4 text-center px-8">{{
					message.header
				}}</span>
				<div class="grid gap-x-3 grid-cols-2 leading-4 text-left mb-4">
					<template v-for="(item, index) in message.body" :key="index">
						<strong class="uppercase text-right flex justify-end items-center"
							>{{
								index?.toString().replaceAll("_", " ").replaceAll("-", " ")
							}}:
						</strong>
						<template v-if="typeof item === 'object'">
							<span />
							<div
								class="col-span-2 bg-surface-100 dark:bg-surface-800 rounded-md px-2 py-1 my-2 grid gap-x-3 grid-cols-2 leading-4 w-full"
							>
								<template v-for="(value, key) in item" :key="key">
									<strong
										class="uppercase text-right flex justify-end items-center"
										>{{
											key?.toString().replaceAll("_", " ").replaceAll("-", " ")
										}}:</strong
									>
									<span>
										{{ value }}
									</span>
								</template>
							</div>
						</template>
						<template v-else>
							<span>{{ item }}</span>
						</template>
					</template>
				</div>
				<p class="mb-0">{{ message.message }}</p>
				<div class="flex items-center gap-2 mt-4">
					<Button label="Confirm" class="w-[8rem]" @click="acceptCallback" />
					<Button
						label="Cancel"
						outlined
						class="w-[8rem]"
						@click="rejectCallback"
					/>
				</div>
			</div>
		</template>
	</ConfirmDialog>
</template>

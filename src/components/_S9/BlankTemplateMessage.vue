<template>
	<div class="h-dvh flex justify-center items-center p-4">
		<div class="intro-x space-y-4">
			<template v-if="$slots.icon">
				<div class="intro-x">
					<slot name="icon" />
				</div>
			</template>
			<template v-if="$slots.title">
				<h2 class="intro-x text-2xl font-bold text-center">
					<slot name="title" />
				</h2>
			</template>
			<template v-if="$slots.content">
				<p class="intro-x text-center text-slate-400">
					<slot name="content" />
				</p>
			</template>
		</div>
	</div>
</template>

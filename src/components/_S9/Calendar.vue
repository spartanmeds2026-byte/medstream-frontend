<script setup lang="ts">
import "@/assets/css/vendors/full-calendar.css"
import { computed } from "vue"
import FullCalendar from "@fullcalendar/vue3"
import interactionPlugin from "@fullcalendar/interaction"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import { type CalendarOptions } from "@fullcalendar/core"

const emit = defineEmits(["eventClick", "select", "eventsSet"])
const props = withDefaults(
	defineProps<{
		events: CalendarOptions["events"]
	}>(),
	{}
)

const handleEventClick = (selectEvent: any) => {
	emit("eventClick", selectEvent)
}

const handleSelect = (selectEvent: any) => {
	emit("select", selectEvent)
}

const handleEventsSet = (events: any) => {
	emit("eventsSet", events)
}

const options = computed<CalendarOptions>(() => {
	return {
		plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
		headerToolbar: {
			left: "prev,next today",
			center: "title",
			right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
		},
		timeZone: "UTC",
		navLinks: true,
		editable: true,
		droppable: true,
		dayMaxEvents: true,
		eventStartEditable: false,
		eventDurationEditable: false,
		eventResizableFromStart: true,
		selectable: true,
		selectMirror: true,
		// businessHours: true,
		initialDate: new Date(),
		events: props.events || [],
		eventClick: handleEventClick,
		select: handleSelect,
		eventsSet: handleEventsSet,
	}
})
</script>

<template>
	<div class="full-calendar">
		<FullCalendar :options="options">
			<template #eventContent="arg">
				<div class="px-2 py-1">
					<slot name="CalendarItem" :item="arg.event" />
				</div>
			</template>
		</FullCalendar>
	</div>
</template>

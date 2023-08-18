<template>
	<div class="calendar">
		<div class="calendar__preview">
			<h1 class="calendar__title">Calendar</h1>
			<p class="calendar__description" v-text="description" />
		</div>
		<calendar-widgets />
		<calendar-table />
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import widthMixin from "~/mixins/width"

// Components
import calendarWidgets from "~/components/calendar/calendar-widgets.vue"
import calendarTable from "~/components/calendar/calendar-table.vue"

export default mixins(widthMixin).extend({
	name: "page-calendar",
	layout: "index",
	transition: "fade-in",
	components: {
		calendarWidgets,
		calendarTable
	},
	computed: {
		description(): string {
			if (this.screenWidth >= 700) {
				return "Our team has put together some useful, easy-to-use crypto-widgets on this page to help you navigate through the presented P2E projects.\n\n This information will additionally help you deepen your knowledge of the GameFi industry and maximize your in-game profits thanks to the advanced data-driven approach. DYOR!"
			} else {
				return "Our team has put together some useful, easy-to-use crypto-widgets on this page to help you navigate through the presented P2E projects.\n\n This information will additionally help you deepen your knowledge of the GameFi industry and maximize your in-game profits thanks to the advanced data-driven approach. DYOR!"
			}
		}
	},
	mounted() {
		this.$scrollTo()

		this.$amplitude.pageView("calendar")
	}
})
</script>

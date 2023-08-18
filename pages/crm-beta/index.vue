<template>
	<div class="crm">
		<h1 class="crm__title">{{ title }}</h1>
		<h2 class="crm__subtitle">{{ subtitle }}</h2>
		<ui-connect v-if="!getIsAuth" />

		<crm-games v-if="getIsAuth" />

		<ui-radio
			v-if="getIsAuth"
			:activeValue="getActiveDayFilter"
			:list="filters"
			:isLoadingData="isLoadingFilters"
			@change="setDay"
		/>

		<crm-total />

		<crm-scholars />
		<ui-table-fullscreen modalTitle="Your scholars" v-if="getIsAuth">
			<crm-scholars class="_table" />
		</ui-table-fullscreen>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Components
import crmGames from "~/components/crm/crm-games.vue"
import crmTotal from "~/components/crm/crm-total.vue"
import crmScholars from "~/components/crm/crm-scholars.vue"

export default Vue.extend({
	name: "page-analytics",
	transition: "fade-in",
	layout: "index",
	head(): { title: string } {
		return {
			title: "| CRM"
		}
	},
	components: {
		crmGames,
		crmTotal,
		crmScholars
	},
	data() {
		return {
			activeFilter: "1D",
			filters: ["1D", "7D", "30D"] as string[],
			isLoadingFilters: false as boolean
		}
	},
	created() {
		this.activeFilter = this.getActiveDayFilter
	},
	mounted() {
		window.setTimeout(() => {
			this.isLoadingFilters = false
		}, 1000)

		this.$scrollTo()
	},
	watch: {
		getActiveDayFilter(value: string) {
			this.activeFilter = value
		}
	},
	computed: {
		...mapGetters({
			getActiveDayFilter: "crm/getActiveDayFilter",
			getLoading: "crm/getLoading",
			getIsAuth: "auth/getIsAuth"
		}),
		title(): string {
			if (this.getIsAuth) {
				return "Track and add scholars in our CRM"
			}
			return "Track scholars"
		},
		subtitle(): string {
			if (this.getIsAuth) {
				return "Choose one of the games to start tracking"
			}
			return "Please connect your wallet to get started"
		}
	},
	methods: {
		...mapActions({
			setFilter: "crm/setFilter"
		}),
		async setDay(value: string) {
			this.isLoadingFilters = true
			await this.setFilter({ type: "activeDayFilter", value: value })
			this.isLoadingFilters = false
		}
	}
})
</script>

<template>
	<div class="crm__total">
		<crm-total-scholars
			v-if="!total.length"
			buttonText="Add first scholars +"
		/>
		<div
			class="crm__total-item"
			v-else
			v-for="{ title, currentValue, deltaValue, type, units } in total"
			:key="title"
		>
			<ui-statistic
				:title="title"
				:data="currentValue"
				:deltaValue="deltaValue"
				:deltaValueType="type"
				:isLoading="isLoading"
				:units="units"
				size="large"
			/>
			<crm-total-scholars v-if="!isLoading && title === 'Total Scholars'" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters, mapActions } from "vuex"

// Components
import crmTotalScholars from "./crm-total-scholars.vue"

export default Vue.extend({
	name: "crm-total",
	components: {
		crmTotalScholars
	},
	async created(): Promise<void> {
		await this.fetchData()
	},
	watch: {
		async getIsAuth(newValue, oldValue) {
			if (!oldValue && newValue) {
				await this.fetchData()
			}
		}
	},
	data() {
		return {
			totalLoading: [
				{
					title: "Total loading 1",
					currentValue: "loading"
				},
				{
					title: "Total loading 2",
					currentValue: "loading"
				},
				{
					title: "AVG winrate 3",
					currentValue: "loading"
				},
				{
					title: "Total loading 4",
					currentValue: "loading"
				},
				{
					title: "Total loading 5",
					currentValue: "loading"
				}
			],
			totalDefault: [
				{
					title: "Total Scholars",
					currentValue: "-"
				},
				{
					title: "Total matches",
					currentValue: "-"
				},
				{
					title: "AVG winrate",
					currentValue: "-"
				},
				{
					title: "Total earnied",
					currentValue: "-"
				},
				{
					title: "Total claimed",
					currentValue: "-"
				}
			]
		}
	},
	computed: {
		...mapGetters({
			getTotal: "crm/getTotal",
			getLoading: "crm/getLoading",
			getIsAuth: "auth/getIsAuth"
		}),
		isLoading(): boolean {
			return this.getLoading("total")
		},
		total(): any {
			if (!this.getIsAuth) {
				return this.totalDefault
			} else if (this.isLoading) {
				return this.totalLoading
			} else {
				return this.getTotal
			}
		}
	},
	methods: {
		...mapActions({
			fetchTotal: "crm/fetchTotal"
		}),
		async fetchData() {
			if (!this.getTotal?.length && this.getIsAuth) {
				await this.fetchTotal()
			}
		}
	}
})
</script>

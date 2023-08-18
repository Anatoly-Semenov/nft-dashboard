<template>
	<div class="ui-chart__block" :class="{ _loading: isLoading }">
		<p class="ui-chart__block-title" v-if="title">
			{{ title }}
		</p>
		<transition name="fade-in">
			<ui-chart
				v-if="!isLoading"
				width="100%"
				:height="chartHeight"
				:type="type"
				:options="options"
				:series="series"
			/>
		</transition>
		<div class="ui-chart__block-stats" v-if="!isLoading && statistic.length">
			<ui-statistic
				v-for="{
					title,
					tooltip,
					data,
					deltaValue,
					deltaValueType
				} in statistic"
				:key="title"
				:title="title"
				:tooltip="tooltip"
				:data="data"
				:deltaValue="deltaValue"
				:deltaValueType="deltaValueType"
				:isLoading="isLoading"
				size="large"
			/>
		</div>
		<div class="ui-chart__block-loading" v-if="isLoading" />
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Types
import {
	UiChartOptions,
	UiChartType,
	UiChartSeries
} from "~/types/ui-kit/ui-chart"
import { UiDeltaType } from "~/types/ui-kit/ui-delta"

export default Vue.extend({
	name: "ui-chart-block",
	props: {
		title: String as PropOptions<string>,
		type: String as PropOptions<UiChartType>,
		options: Object as PropOptions<UiChartOptions>,
		series: Array as PropOptions<UiChartSeries>,
		statistic: {
			type: Array,
			default: () => []
		} as PropOptions<
			{
				title: string
				data: number
				deltaValue?: string
				deltaValueType?: UiDeltaType
				tooltip?: string
			}[]
		>,
		chartHeight: {
			type: [String, Number],
			default: "auto"
		} as PropOptions<string | number>,
		isLoading: Boolean as PropOptions<boolean>
	},
	data() {
		return {}
	}
})
</script>

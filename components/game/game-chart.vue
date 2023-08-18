<template>
	<div class="game__chart" :class="{ _loading: isLoading }">
		<p class="game__chart-title" v-if="title">
			{{ title }}
		</p>
		<slot name="before-chart" v-if="!isLoading" />
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
		<div class="game__chart-stats" v-if="!isLoading && statistic.length">
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
				size="small"
			/>
		</div>
		<div class="game__chart-loading" v-if="isLoading" />
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions, PropType } from "vue"

// Types
import {
	UiChartOptions,
	UiChartType,
	UiChartSeries
} from "~/types/ui-kit/ui-chart"
import { UiDeltaType } from "~/types/ui-kit/ui-delta"

export default Vue.extend({
	name: "game-chart",
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
		chartHeight: [String, Number] as PropOptions<string | number>,
		isLoading: {
			type: Boolean as PropType<boolean>,
			default: false
		}
	}
})
</script>

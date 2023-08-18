<template>
	<client-only>
		<apex-chart
			class="ui-chart"
			:width="renderedProps.width || 500"
			:height="renderedProps.height || 'auto'"
			:type="renderedProps.type || 'line'"
			:options="renderedProps.chartOptions || {}"
			:series="renderedProps.series || []"
			:key="key"
		/>
	</client-only>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// ApexChart component
import ApexChart from "vue-apexcharts"

// Types
import {
	UiChartOptions,
	UiChartType,
	UiChartSeries
} from "~/types/ui-kit/ui-chart"

// Lodash
import _cloneDeep from "lodash/cloneDeep"

export default Vue.extend({
	name: "ui-chart",
	components: {
		ApexChart
	},
	props: {
		width: {
			type: String,
			default: "500"
		} as PropOptions<string>,
		height: [String, Number],
		type: {
			type: String,
			default: "bar"
		} as PropOptions<UiChartType>,
		options: Object as PropOptions<UiChartOptions>,
		series: Array as PropOptions<UiChartSeries>
	},
	data() {
		return {
			key: 1 as number,
			renderedProps: {
				width: null,
				height: null,
				type: null,
				chartOptions: null,
				series: null
			}
		}
	},
	created() {
		this.setPropData("width", this.width)
		this.setPropData("height", this.height)
		this.setPropData("type", this.type)
		this.setPropData("chartOptions", this.chartOptions)
		this.setPropData("series", this.series)
	},
	watch: {
		width(value): void {
			this.setPropData("width", value)
		},
		height(value): void {
			this.setPropData("height", value)
		},
		type(value): void {
			this.setPropData("type", value)
		},
		chartOptions(value): void {
			this.setPropData("chartOptions", value)
		},
		series(value): void {
			this.setPropData("series", value)
			if (this.key < 2) this.key++
		}
	},
	computed: {
		chartOptions(): UiChartOptions {
			const options = _cloneDeep(this.options)

			if (options?.chart) {
				options.chart.fontFamily = "SF Pro Display"
				options.chart.width = "100%"
			} else {
				options.chart = {
					fontFamily: "SF Pro Display",
					width: "100%"
				}
			}

			if (options?.grid) {
				options.grid.borderColor = "#37394B"
			} else {
				options.grid = {
					borderColor: "#37394B"
				}
			}

			return options
		}
	},
	methods: {
		setPropData(name: any, value: any): void {
			// @ts-ignore
			if (!this.renderedProps[name]) {
				// @ts-ignore
				this.renderedProps[name] = value
			}
		}
	}
})
</script>

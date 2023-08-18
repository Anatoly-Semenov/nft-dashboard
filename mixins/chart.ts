import Vue from "vue"

// Types
import { UiChartsBlockProps } from "~/types/ui-kit/ui-charts-block"
import { UiChartOptions } from "~/types/ui-kit/ui-chart"

export const baseChart = Vue.extend({
	data() {
		return {
			isLoading: false as boolean
		}
	},
	methods: {
		baseChart(
			title: string,
			series: { name: string; data: any[][] }[],
			isLoading = false,
			type = "area"
		): UiChartsBlockProps {
			const isBigSeries: boolean =
				!!series?.find(({ data }) => {
					return data?.length > 20
				}) || false

			return {
				title: title,
				type: type,
				isLoading: isLoading,
				chartHeight: 290,
				options: {
					colors: ["var(--color-highlight)", "var(--color-warning)"],
					chart: {
						animations: {
							enabled: false
						},
						type: "line",
						height: 280,
						toolbar: {
							show: false
						},
						dropShadow: {
							enabled: false,
							enabledOnSeries: undefined,
							top: 0,
							left: 0,
							blur: 10,
							color: "#000000",
							opacity: 0.55
						},
						zoom: {
							enabled: false
						}
					},
					dataLabels: {
						enabled: false
					},
					markers: {
						size: isBigSeries ? 0 : 3
					},
					stroke: {
						curve: "smooth"
					},
					fill: {
						colors: [
							"var(--color-highlight-chart-shadow)",
							"var(--color-warning-chart-shadow)"
						],
						type: "gradient",
						gradient: {
							shadeIntensity: 0,
							inverseColors: false,
							opacityFrom: 1,
							opacityTo: 0.2,
							stops: [20, 100, 100, 100]
						}
					},
					xaxis: {
						type: "datetime",
						axisBorder: {
							show: false
						}
					},
					yaxis: {
						min: 0,
						labels: {
							formatter: (value) => this.$formatNumber(value, "number")
						}
					}
				} as UiChartOptions,
				series: series
			}
		}
	}
})

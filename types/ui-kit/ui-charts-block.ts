import { UiChartOptions } from "~/types/ui-kit/ui-chart"
import { UiDeltaType } from "~/types/ui-kit/ui-delta"

export interface UiChartsBlockProps {
	title: string
	type: string
	isLoading: boolean
	options: UiChartOptions
	series: object[]
	size?: "big"
	chartHeight?: number
	statistic?: {
		title: string
		data: number | string
		deltaValue: number
		deltaValueType: UiDeltaType
		tooltip?: string
	}[]
}

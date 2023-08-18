<template>
	<div class="game__charts-list _economic">
		<div class="game__charts-content">
			<div class="game__charts-row">
				<game-chart class="game__charts-earning" v-bind="earningSpending">
					<div
						class="game__charts-earning-info"
						slot="before-chart"
						v-if="screenWidth > 800"
					>
						<div
							class="game__charts-earning-block"
							v-for="({ users, profit, avgRoi }, index) in earningSpendingStats"
							:key="index"
						>
							<div class="game__charts-earning-list">
								<p class="game__charts-earning-item">
									Users:
									<span>{{ users }}</span>
								</p>
								<p class="game__charts-earning-item">
									Users in profit:
									<span>{{ profit }}</span>
								</p>
								<p class="game__charts-earning-item">
									Avg ROI:
									<span>{{ avgRoi }}</span>
								</p>
							</div>
						</div>
					</div>
				</game-chart>
				<game-chart v-bind="users" />
			</div>
		</div>
		<div class="game__charts-content">
			<p class="game__charts-title">Earnings / Spending</p>
			<div class="game__charts-row">
				<game-chart v-bind="spendingEarning" />
				<game-chart v-bind="spendersEarners" />
				<game-chart v-bind="average" />
				<div />
			</div>
		</div>
		<div class="game__charts-content">
			<p class="game__charts-title">NFTs</p>
			<div class="game__charts-row">
				<game-chart v-bind="nft" />
				<game-chart v-bind="burnMint" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"
import dayjs from "dayjs"

// Mixins
import { baseChart } from "~/mixins/chart"
import widthMixin from "~/mixins/width"

// Components
const gameChart = () =>
	import(/* webpackChunkName: "game-chart" */ "./game-chart.vue")

// Types
import type { UiChartOptions } from "~/types/ui-kit/ui-chart"
import type { EconomicSeries } from "~/types/game-charts"
import type { GameService } from "@nft-types"

// Chart interfaces
interface ChartsProps {
	title: string
	type: string
	isLoading: boolean
	options: UiChartOptions
	series: object[]
	size?: "big"
}

export default mixins(baseChart, widthMixin).extend({
	name: "game-charts-economic",
	components: {
		gameChart
	},
	data() {
		return {}
	},
	async created() {
		if (!this.isFetchedData("economic")) {
			this.isLoading = true

			await this.fetchAllCharts()

			this.isLoading = false
		}
	},
	methods: {
		...mapActions({
			fetchAllCharts: "games-charts/fetchAllCharts"
		})
	},
	computed: {
		...mapGetters({
			getSeries: "games-charts/getSeries",
			isFetchedData: "games-charts/getIsFetchedData",
			getLoadingCharts: "games-charts/getLoadingCharts"
		}),
		earningSpendingStats(): Array<{
			users: number
			profit: string
			avgRoi: string
		}> {
			const series: EconomicSeries["spendingEarning"]["monthly"] =
				this.getSeries("spendingEarning")[0]?.monthly

			const getSign = (value: number): string => {
				return Math.sign(value) === 1 ? "+" : ""
			}

			const stats: {
				users: number
				profit: string
				avgRoi: string
			}[] = []

			if (series) {
				series.forEach(({ users_count, avg_roi, percent_in_profit }) => {
					stats.push({
						users: users_count,
						profit: `${Math.round(percent_in_profit)}%`,
						avgRoi: `${getSign(avg_roi)}${Math.round(
							Number(this.$formatNumber(avg_roi, "percent"))
						)}%`
					})
				})
			}

			return stats
		},
		earningSpending(): ChartsProps {
			const series: EconomicSeries["spendingEarning"]["monthly"] =
				this.getSeries("spendingEarning")[0]?.monthly

			const earning: number[] = []
			const spending: number[] = []
			const categories: string[] = []

			if (series) {
				series.forEach((item: GameService.SpendingAndEarningsItem) => {
					earning.push(item.earnings)
					spending.push(item.spending)

					const start = dayjs(item.started_at).format("DD MMM")
					const end = dayjs(item.ended_at).format("DD MMM")

					categories.push(`${start} — ${end}`)
				})
			}

			const props = this.baseChart(
				"Earning / Spending in USD",
				[
					{
						name: "Earning",
						// @ts-ignore
						data: earning
					},
					{
						name: "Spending",
						// @ts-ignore
						data: spending
					}
				],
				this.getLoadingCharts().spendingEarning
			)

			props.options.xaxis = {
				categories: categories
			}

			props.type = "bar"
			props.chartHeight = 300

			props.options.colors = ["var(--color-ui-hover)", "var(--color-error)"]

			props.options.chart = {
				type: "bar",
				height: 280
			}

			props.options.stroke = {
				show: true,
				width: 2,
				colors: ["transparent"]
			}

			props.options.fill = {
				opacity: 1
			}

			const formatNumber = (val: number) => {
				return this.$formatNumber(val)
			}

			props.options.tooltip = {
				y: {
					formatter: function (val) {
						return `$ ${formatNumber(val)}`
					}
				}
			}

			// Todo: tomporary hide
			// props.statistic = [
			// 	{
			// 		title: "Spent in 3 weeks",
			// 		tooltip: "Spent in 3 weeks",
			// 		deltaValue: 0,
			// 		deltaValueType: "percents",
			// 		data: "200$"
			// 	},
			// 	{
			// 		title: `Earned in 3 weeks`,
			// 		tooltip: "Earned in 3 weeks",
			// 		deltaValue: 0,
			// 		deltaValueType: "percents",
			// 		data: "200$"
			// 	},
			// 	{
			// 		title: "Payback in 3 weeks",
			// 		tooltip: "Payback in 3 weeks",
			// 		deltaValue: 0,
			// 		deltaValueType: "percents",
			// 		data: "200$"
			// 	},
			// 	{
			// 		title: "Average earnings",
			// 		tooltip: "Average earnings",
			// 		deltaValue: 0,
			// 		deltaValueType: "percents",
			// 		data: "200$"
			// 	}
			// ]

			return props
		},
		users(): ChartsProps {
			const activeUsers = []
			const newUsers = []

			for (const [key, value] of Object.entries(
				this.getSeries("users")?.[0] || {}
			)) {
				const day = key.slice(0, 3)
				const month = key.slice(3, 6)
				const year = key.slice(6, Infinity)
				const strDate = month + day + year

				const date: string = dayjs(strDate).format("MM-DD-YYYY")

				// @ts-ignore
				activeUsers.push([date, value.active_users])
				// @ts-ignore
				newUsers.push([date, value.new_users])
			}

			activeUsers.sort((a, b) => {
				return dayjs(a[0]).unix() - dayjs(b[0]).unix()
			})

			newUsers.sort((a, b) => {
				return dayjs(a[0]).unix() - dayjs(b[0]).unix()
			})

			const props = this.baseChart(
				"Users by date",
				[
					{
						name: "Active users",
						data: activeUsers.slice(-30)
					},
					{
						name: "New users",
						data: newUsers.slice(-30)
					}
				],
				this.getLoadingCharts().users
			)

			props.chartHeight = 338

			props.options.fill!.gradient!.stops = [70, 100, 100, 100]

			return props
		},
		average(): ChartsProps {
			const average = []
			const usersCount = []

			for (const [key, value] of Object.entries(
				this.getSeries("average")?.[0] || {}
			)) {
				const day = key.slice(0, 3)
				const month = key.slice(3, 6)
				const year = key.slice(6, Infinity)
				const strDate = month + day + year

				const date: string = dayjs(strDate).format("MM-DD-YYYY")

				// @ts-ignore
				average.push([date, value.average])
				// @ts-ignore
				usersCount.push([date, value.users_count])
			}

			const props = this.baseChart(
				"Avg. earnings in USD",
				[
					{
						name: "Users",
						data: usersCount.slice(-14)
					},
					{
						name: "Avg. earn",
						data: average.slice(-14)
					}
				],
				this.getLoadingCharts().average
			)

			props.options.fill!.gradient!.stops = [75, 100, 100, 100]

			return props
		},
		spendingEarning(): ChartsProps {
			const spending = []
			const earning = []

			for (const [key, value] of Object.entries(
				this.getSeries("spendersEarners")?.[0] || {}
			)) {
				const day = key.slice(0, 3)
				const month = key.slice(3, 6)
				const year = key.slice(6, Infinity)
				const strDate = month + day + year

				const date: string = dayjs(strDate).format("MM-DD-YYYY")

				// @ts-ignore
				spending.push([date, Math.abs(value.spending)])
				// @ts-ignore
				earning.push([date, value.earning])
			}

			const props = this.baseChart(
				"Spenders / Earners",
				[
					{
						name: "Earning",
						data: earning.slice(-14)
					},
					{
						name: "Spending",
						data: spending.slice(-14)
					}
				],
				this.getLoadingCharts().spendersEarners,
				"bar"
			)

			props.options.colors = props.options.fill!.colors = [
				"var(--color-error-active)",
				"var(--color-link)"
			]

			props.options.fill!.type = ""
			props.options.plotOptions = {
				bar: {
					borderRadius: 4
				}
			}

			const formatNumber = (val: number) => {
				return this.$formatNumber(val)
			}

			props.options.tooltip = {
				y: {
					formatter: function (val) {
						return `$ ${formatNumber(val)}`
					}
				}
			}

			props.options.chart!.type = "bar"

			return props
		},
		spendersEarners(): ChartsProps {
			const spenders = []
			const earners = []

			for (const [key, value] of Object.entries(
				this.getSeries("spendersEarners")?.[0] || {}
			)) {
				const day = key.slice(0, 3)
				const month = key.slice(3, 6)
				const year = key.slice(6, Infinity)
				const strDate = month + day + year

				const date: string = dayjs(strDate).format("MM-DD-YYYY")

				// @ts-ignore
				spenders.push([date, value.spenders])
				// @ts-ignore
				earners.push([date, value.earners])
			}

			const props = this.baseChart(
				"Spenders / Earners",
				[
					{
						name: "Earners",
						data: earners.slice(-14)
					},
					{
						name: "Spenders",
						data: spenders.slice(-14)
					}
				],
				this.getLoadingCharts().spendersEarners
			)

			props.options.fill!.gradient!.stops = [75, 100, 100, 100]

			return props
		},
		nft(): ChartsProps {
			const series: EconomicSeries["nft"]["daily"] =
				this.getSeries("nft")[0]?.daily

			const amount: Array<string | number>[] = []
			const count: Array<string | number>[] = []

			if (series) {
				// @ts-ignore
				series.forEach((item: GameService.NftTradesItem) => {
					amount.push([item.date, item.amount])
					count.push([item.date, item.count])
				})
			}

			const formatNumber = (val: number) => {
				return this.$formatNumber(val, "number")
			}

			const props = this.baseChart(
				"NFT trades",
				[
					{
						name: "Amount",
						data: amount
					},
					{
						name: "Count",
						data: count
					}
				],
				this.getLoadingCharts().nft
			)

			props.options.tooltip = {
				y: {
					formatter: function (val, detail) {
						return `${detail.seriesIndex === 0 ? "$ " : ""}${formatNumber(val)}`
					}
				}
			}

			props.options.fill!.gradient!.stops = [90, 100, 100, 100]
			props.options.fill!.gradient!.opacityTo = 0.8

			return props
		},
		burnMint(): ChartsProps {
			const series: EconomicSeries["burnMint"]["daily"] =
				this.getSeries("burnMint")[0]?.daily

			const burn: Array<string | number>[] = []
			const mint: Array<string | number>[] = []

			if (series) {
				// @ts-ignore
				series.forEach((item: GameService.NtfBurnAndMintItem) => {
					burn.push([item.date, item.burn])
					mint.push([item.date, item.mint])
				})
			}

			const props = this.baseChart(
				"Burn / Mint",
				[
					{
						name: "Mint",
						data: mint
					},
					{
						name: "Burn",
						data: burn
					}
				],
				this.getLoadingCharts().burnMint
			)

			props.options.fill!.gradient!.stops = [85, 100, 100, 100]

			return props
		}
	}
})
</script>

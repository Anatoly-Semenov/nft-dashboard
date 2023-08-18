<template>
	<div class="game__charts-list _social">
		<div class="game__charts-row" v-if="isTwitterBlock">
			<game-chart v-bind="twitter" :style="twitterStyles" v-if="isTwitter" />
			<div
				class="game__charts-twitter"
				:class="{ _loading: !twitterLink }"
				:key="twitterLink"
				v-if="isTwitterLink"
			>
				<a
					class="twitter-timeline"
					data-lang="en"
					data-theme="dark"
					:href="`${twitterLink}?ref_src=twsrc%5Etfw`"
				>
					Tweets
				</a>
				<script
					async
					src="https://platform.twitter.com/widgets.js"
					charset="utf-8"
				></script>
			</div>
		</div>
		<div class="game__charts-row _full" v-if="isSecondBlock">
			<game-chart v-if="isDiscord" v-bind="discord" />
			<game-chart v-if="isTelegram" v-bind="telegram" />
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import dayjs, { Dayjs } from "dayjs"
import { mapActions, mapGetters } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"
import { baseChart } from "~/mixins/chart"

// Components
const gameChart = () =>
	import(/* webpackChunkName: "game-chart" */ "./game-chart.vue")

// Types
import type { SocialService } from "@nft-types"

import type { UiChartsBlockProps } from "~/types/ui-kit/ui-charts-block"

import type { Series } from "~/types/game-charts"

export default mixins(widthMixin, baseChart).extend({
	name: "game-charts-social",
	components: {
		gameChart
	},
	props: {
		gameId: {
			type: Number,
			default: 0
		}
	},
	async created() {
		if (!this.isFetchedData("social")) {
			this.isLoading = true

			await Promise.all([
				this.fetchAllCharts("social"),
				this.fetchTwitterLink()
			]).catch((e) => {})

			this.isLoading = false
		}
	},
	computed: {
		...mapGetters({
			isFetchedData: "games-charts/getIsFetchedData",
			getSeries: "games-charts/getSeries",
			getStatistic: "games-charts/getStatistic",
			twitterLink: "games-charts/getTwitterLink"
		}),
		twitterStats(): SocialService.Stats {
			return this.getStatistic("twitter", "social")
		},
		twitterData(): Series {
			return this.getSeries("twitter", "social")
		},
		discordData(): Series {
			return this.getSeries("discord", "social")?.[0] || null
		},
		discordDataOnline(): Series {
			return this.getSeries("discord", "social")?.[1] || null
		},
		telegramData(): Series {
			return this.getSeries("telegram", "social")
		},
		twitter(): UiChartsBlockProps {
			const yesterday: Dayjs = dayjs().add(-1, "day")

			const day: string = yesterday.format("DD")
			const month: string = yesterday.format("MMMM")

			const tooltip = (name: string) => {
				return `Number of ${name} for\n the ${day}th of ${month}`
			}

			return {
				chartHeight: 300,
				...this.baseChart(
					"Twitter",
					[
						{
							name: "Members count",
							data: this.twitterData
						}
					],
					this.isLoading
				),
				statistic: [
					{
						title: "Posts",
						tooltip: tooltip("posts"),
						deltaValue: this.twitterStats?.posts_growth_percentage || 0,
						deltaValueType: "percents",
						data: this.convertValues(this.twitterStats?.posts_count)
					},
					{
						title: `Comments`,
						tooltip: tooltip("comments"),
						deltaValue: this.twitterStats?.comments_growth_percentage || 0,
						deltaValueType: "percents",
						data: this.convertValues(this.twitterStats?.comments_count)
					},
					{
						title: "Likes",
						tooltip: tooltip("likes"),
						deltaValue: this.twitterStats?.likes_growth_percentage || 0,
						deltaValueType: "percents",
						data: this.convertValues(this.twitterStats?.likes_count)
					},
					{
						title: "Reposts",
						tooltip: tooltip("reposts"),
						deltaValue: this.twitterStats?.reposts_growth_percentage || 0,
						deltaValueType: "percents",
						data: this.convertValues(this.twitterStats?.reposts_count)
					}
				]
			}
		},
		discord(): UiChartsBlockProps {
			return this.baseChart(
				"Discord",
				[
					{
						name: "Members count",
						data: this.discordData
					},
					{
						name: "Members online count",
						data: this.discordDataOnline
					}
				],
				this.isLoading
			)
		},
		telegram(): UiChartsBlockProps {
			return this.baseChart(
				"Telegram",
				[
					{
						name: "Members count",
						data: this.telegramData
					}
				],
				this.isLoading
			)
		},
		twitterStyles(): object {
			const styles = {
				width: "65%"
			}

			if (this.screenWidth < 1024) {
				styles.width = "100%"
			}

			return styles
		},
		isTwitter(): boolean {
			return this.isLoading || this.isData("twitter")
		},
		isTwitterLink(): boolean {
			return this.isLoading || this.twitterLink
		},
		isTwitterBlock(): boolean {
			return this.isLoading || this.isTwitter || this.twitterLink
		},
		isDiscord(): boolean {
			return this.isLoading || this.isData("discord")
		},
		isTelegram(): boolean {
			return this.isLoading || this.isData("telegram")
		},
		isSecondBlock(): boolean {
			return this.isLoading || this.isDiscord || this.isTelegram
		}
	},
	methods: {
		...mapActions({
			fetchAllCharts: "games-charts/fetchAllCharts",
			fetchTwitterLink: "games-charts/fetchTwitterLink"
		}),
		convertValues(value: number | null | undefined): number | string {
			if (typeof value === "number") {
				return value
			} else {
				return "n/a"
			}
		},
		isData(name: "twitter" | "discord" | "telegram"): boolean {
			// @ts-ignore
			return this.isLoading || !!this[`${name}Data`]?.length
		}
	}
})
</script>

<template>
	<div class="game__statistics">
		<ui-statistic
			v-for="{ title, tooltip, value, isSlot } in data"
			:key="title"
			:title="title"
			:tooltip="tooltip"
			:data="value"
			:isLoading="isLoading"
			:isSlot="isSlot"
			size="large"
		>
			<template v-if="title === 'NFT'">
				<button
					class="calendar__link"
					v-if="value.marketplace"
					@click="$toLink(value.marketplace)"
				>
					<ui-tag
						class="calendar__tag-date"
						color="var(--color-highlight)"
						:loading="isLoading"
					>
						{{ value.status === "Ongoing" ? "Ongoing" : "Marketplace" }}
						<ui-icon type="link" v-if="!isLoading" />
					</ui-tag>
				</button>
				<ui-tag
					v-else
					class="calendar__tag-date"
					color="var(--color-background-secondary)"
					:class="{ _tba: !value.ino_date || value.ino_date === 'tba' }"
					:loading="isLoading"
				>
					{{ value.ino_date || "TBA" }}
				</ui-tag>
			</template>
			<template v-else-if="title === 'Risk level'">
				<p class="game__statistics-risk" :class="`_${value}`">{{ value }}</p>
			</template>
		</ui-statistic>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Interfaces
import { UiStatisticBlock } from "~/types/ui-kit/ui-statistic"

export default Vue.extend({
	name: "game-statistics",
	props: {
		isLoading: {
			type: Boolean,
			default: false
		},
		isUpcoming: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters({
			getGameStatistic: "games/getGameStatistic",
			getUpcomingGameStatistic: "games/getUpcomingGameStatistic"
		}),
		data(): UiStatisticBlock[] {
			if (this.isUpcoming) return this.upcomingData

			return this.mainData
		},
		upcomingData(): UiStatisticBlock[] {
			const { release, ido, nft } = this.getUpcomingGameStatistic

			return [
				{
					title: "Game release",
					tooltip: "Game release date",
					value: this.$formatDate({ ...release, hasYear: true })
				},
				{
					title: "IDO",
					tooltip: "IDO date",
					value:
						ido.status === "Ongoing"
							? "Ongoing"
							: this.$formatDate({ ...ido, hasYear: true })
				},
				{
					title: "NFT",
					tooltip: "Game release date",
					value: nft,
					isSlot: true
				}
			]
		},
		mainData(): UiStatisticBlock[] {
			const { newUsers, percentInProfit, avgRoi, riskLevel } =
				this.getGameStatistic

			return [
				{
					title: "New paying users",
					tooltip: "New users in the game",
					value: newUsers
				},
				{
					title: "% in profit",
					tooltip: "% in profit",
					value: percentInProfit
				},
				{
					title: "Avg. ROI",
					tooltip: "Avg. ROI",
					value: avgRoi ? `${this.$formatNumber(avgRoi, "percent")}%` : "n/a"
				},
				{
					title: "Risk level",
					tooltip: "Risk level",
					value: riskLevel,
					isSlot: true
				}
			]
		}
	}
})
</script>

<template>
	<div class="profile-stats__item" :class="{ _loading: isLoading }">
		<div class="profile-stats__item-info">
			<div class="profile-stats__item-img" v-if="isLoading" />
			<img class="profile-stats__item-img" v-else :src="game.logo" />
			<div class="profile-stats__item-text">
				<p class="profile-stats__item-name">
					{{ game.title }}
				</p>
				<nuxt-link class="profile-stats__item-link" :to="gameLink">
					Learn more
				</nuxt-link>
			</div>
		</div>
		<div class="profile-stats__item-analytics" v-if="isActive">
			<profile-stats-charts :stats="stats" :isLoading="isLoading" />
			<!--		Todo: add charts		-->
			<ui-statistic
				v-for="{ title, tooltip, value } in statistic"
				:key="title"
				:title="title"
				:tooltip="tooltip"
				:data="value"
				:isLoading="isLoading"
			/>
		</div>
		<ui-button v-else @click="$emit('addWallet')">Add more wallets</ui-button>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

// Components
const profileStatsCharts = () =>
	import(
		/* webpackChunkName: "profile-stats-charts" */ "./profile-stats-charts.vue"
	)

// Types
import type { ProfileService } from "@nft-types"
import type { GameService } from "@nft-types"

export default Vue.extend({
	name: "profile-stats-item",
	components: {
		profileStatsCharts
	},
	props: {
		data: Object as PropType<ProfileService.Game>,
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		game(): GameService.GameDetail {
			// @ts-ignore
			return this.data.game
		},
		gameLink(): string {
			return `/games/${this.game.id}${
				this.game.is_upcoming ? "?type=upcoming" : ""
			}`
		},
		isActive(): ProfileService.Game["isActive"] {
			return this.data.isActive
		},
		stats(): ProfileService.Game["stats"] {
			return this.data.stats
		},
		statistic(): { title: string; tooltip: string; value: number | string }[] {
			return [
				{
					title: "ROI",
					tooltip: "ROI value for this game",
					value: `${Math.round(
						// @ts-ignore
						this.$formatNumber(this.stats.roi!, "percent")
					)}%`
				},
				{
					title: "POINTS",
					tooltip: "POINTS",
					value: this.stats.points
				}
			]
		}
	}
})
</script>

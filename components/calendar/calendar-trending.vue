<template>
	<div class="calendar__trending" :class="{ _loading: isLoading }">
		<div class="calendar__trending-intro">
			<ui-game :game="data" upcoming :loading="isLoading" />
			<ui-blockchains :data="data.chains" :loading="isLoading" />
		</div>
		<div class="calendar__trending-socials">
			<div class="calendar__trending-social">
				<p class="calendar__trending-name">
					<icon-twitter />
					Twitter
				</p>
				<ui-statistic
					v-if="!isLoading"
					:data="twitter.value"
					:deltaValue="twitter.deltaValue"
					deltaValueType="percents"
					size="small"
				/>
			</div>
			<div class="calendar__trending-social">
				<p class="calendar__trending-name">
					<icon-discord />
					Discord
				</p>
				<ui-statistic
					v-if="!isLoading"
					:data="discord.value"
					:deltaValue="discord.deltaValue"
					deltaValueType="percents"
					size="small"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Icons
const iconTwitter = () =>
	import(
		/* webpackChunkName: "icon-twitter" */ "~/assets/img/icons/social/icon-twitter.svg"
	)
const iconDiscord = () =>
	import(
		/* webpackChunkName: "icon-discord" */ "~/assets/img/icons/social/icon-discord.svg"
	)

// Interfaces
import type { GameService } from "@sk-types"

export default Vue.extend({
	name: "calendar-trending",
	components: {
		iconTwitter,
		iconDiscord
	},
	props: {
		data: Object as PropOptions<GameService.UpcomingGame>,
		isLoading: Boolean
	},
	computed: {
		twitter(): { value: number; deltaValue: number } {
			return {
				value: this.data.communities?.twitter?.members_count || 0,
				deltaValue:
					this.data.communities?.twitter?.members_growth_percentage || 0
			}
		},
		discord(): { value: number; deltaValue: number } {
			return {
				value: this.data.communities?.discord?.members_count || 0,
				deltaValue:
					this.data.communities?.discord?.members_growth_percentage || 0
			}
		}
	}
})
</script>

<template>
	<div class="profile-stats__charts" :class="{ _loading: isLoading }">
		<div
			class="profile-stats__charts-item"
			v-for="({ percent, value, type }, index) in charts"
			:key="index"
		>
			<div
				class="profile-stats__charts-progress"
				:class="{ _earn: type === 'earn' }"
				:style="`width: ${percent};`"
			/>
			<div class="profile-stats__charts-value">{{ value }}</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

// Types
import type { ProfileService } from "@nft-types"

interface Chart {
	percent: string
	value: string
	type: "spend" | "earn"
}

export default Vue.extend({
	name: "profile-stats-charts",
	props: {
		stats: Object as PropType<ProfileService.Game["stats"]>,
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		charts(): Chart[] {
			return [
				{
					percent: "70%",
					value: `${this.stats.earn}$`,
					type: "earn"
				},
				{
					percent: "30%",
					value: `-${this.stats.spend}$`,
					type: "spend"
				}
			]
		}
	}
})
</script>

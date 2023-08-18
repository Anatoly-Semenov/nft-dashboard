<template>
	<div class="game__tokens" :class="{ _loading: isLoading }" v-if="tokens">
		<div
			class="game__tokens-item"
			:class="{ _loading: isLoading }"
			v-for="(
				{
					title,
					image,
					ticker,
					price,
					price_delta,
					market_cap,
					market_cap_delta
				},
				index
			) in tokens"
			:key="index"
		>
			<div class="game__tokens-profile">
				<ui-avatar :src="image" :size="56" v-if="!isLoading" />
				<div class="ui-avatar" v-else />
				<div class="game__tokens-text">
					<p class="game__tokens-name">{{ title }}</p>
					<p class="game__tokens-coin" v-if="ticker">{{ ticker }}</p>
				</div>
			</div>
			<div class="game__tokens-stats">
				<ui-statistic
					v-if="ticker && price"
					:title="`${ticker} Price`"
					:data="`$${price}`"
					:deltaValue="price_delta"
					:isLoading="isLoading"
					deltaValueType="percents"
					size="large"
				/>
				<ui-statistic
					title="Market Cap"
					v-if="market_cap"
					:data="`$${market_cap}`"
					:deltaValue="market_cap_delta"
					:isLoading="isLoading"
					deltaValueType="percents"
					size="large"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Types
import type { GameService } from "@nft-types"

// Mocks
import { gameTokens as loadingTokens } from "~/static/mocks"

export default Vue.extend({
	name: "game-tokens",
	props: {
		id: [String, Number]
	},
	async fetch(): Promise<void> {
		this.isLoading = true

		await this.fetchTokens(this.id)

		this.isLoading = false
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	beforeDestroy() {
		// reset token data
		this.setTokens()
	},
	computed: {
		...mapGetters({
			getTokens: "games/getTokens"
		}),
		tokens(): GameService.TokenContract[] {
			return this.isLoading ? loadingTokens : this.getTokens
		}
	},
	methods: {
		...mapActions({
			fetchTokens: "games/fetchTokens"
		}),
		...mapMutations({
			setTokens: "games/setTokens"
		})
	}
})
</script>

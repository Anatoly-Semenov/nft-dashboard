<template>
	<div class="profile-stats" :class="{ _loading: isLoading }">
		<div class="profile-stats__totals">
			<div
				class="profile-stats__total"
				v-for="{ title, value } in totals"
				:key="title"
			>
				<p class="profile-stats__total-title">{{ title }}</p>

				<ui-delta :value="value" :hideZeroValues="false" />
			</div>
		</div>
		<profile-stats-item
			v-for="(data, index) in games"
			:key="index"
			:data="data"
			:isLoading="isLoading"
			@addWallet="addWallet"
		/>
		<profile-wallet
			:display="profileWallet.isDisplay"
			:type="profileWallet.type"
			@close="profileWallet.isDisplay = false"
		/>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Components
const profileStatsItem = () =>
	import(
		/* webpackChunkName: "profile-stats-item" */ "./profile-stats-item.vue"
	)

// Mixins
import walletMixin from "~/mixins/walelt"

// Mocks
import { profileGamesList as loadingGames } from "~/static/mocks"

// Types
import type { ProfileService } from "@sk-types"
interface Total {
	title: string
	value: number
}

export default mixins(walletMixin).extend({
	name: "profile-game",
	components: {
		profileStatsItem
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async fetch() {
		this.isLoading = true
		await this.fetchGamesList()
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getGames: "profile/getGames",
			getGamesTotal: "profile/getGamesTotal"
		}),
		totals(): Total[] {
			return [
				{
					title: "Total spending",
					value: -this.getGamesTotal.spending
				},
				{
					title: "Total earning",
					value: this.getGamesTotal.spending
				}
			]
		},
		games(): ProfileService.Game[] {
			return this.isLoading ? loadingGames : this.getGames
		}
	},
	methods: {
		...mapActions({
			fetchGamesList: "profile/fetchGamesList"
		})
	}
})
</script>

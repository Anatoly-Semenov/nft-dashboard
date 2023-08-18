<template>
	<div class="profile__public" :class="{ _loading: isLoading }">
		<div class="profile__public-profile">
			<template v-if="!isLoading">
				<ui-avatar v-if="avatar" :src="avatar" :size="56" />
				<ui-jazzicon v-else :address="wallet" :diameter="56" />
			</template>
			<div class="profile__public-avatar" v-else />
			<div class="profile__public-text">
				<p class="profile__public-name">{{ name }}</p>
				<button
					class="profile__public-wallet"
					@click="$copy(wallet)"
					v-if="wallet && $shortWallet(wallet)"
				>
					<icon-wallet />
					{{ $shortWallet(wallet) }}
				</button>
			</div>
		</div>
		<div class="profile__public-stats">
			<div
				class="profile__public-stat"
				v-for="({ name, value }, index) in stats"
				:key="index"
			>
				<span>{{ value }}</span>
				{{ name }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Icons
const iconWallet = () =>
	import(
		/* webpackChunkName: "icon-wallet" */ "~/assets/img/icons/icon-wallet.svg"
	)

// Mocks
import { publicProfile as loadingProfile } from "~/static/mocks"

// Types
import { ProfileService } from "@nft-types"

export default Vue.extend({
	name: "profile-public",
	components: {
		iconWallet
	},
	data() {
		return {
			isLoading: false
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchPublicProfile(this.id)
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getPublicProfile: "profile/getPublicProfile"
		}),
		id(): string {
			return this.$route.params.id
		},
		profile(): ProfileService.PublicProfile {
			return this.isLoading ? loadingProfile : this.getPublicProfile
		},
		stats(): any {
			return [
				{
					name: "Achievements",
					value: this.profile?.total_achievements || 0
				},
				{
					name: "games",
					value: this.profile?.total_games || 0
				}
			]
		},
		avatar(): string {
			return this.profile?.avatar || ""
		},
		name(): string {
			return this.profile?.name || "Nameless"
		},
		wallet(): string {
			return this.profile?.wallet || ""
		}
	},
	methods: {
		...mapActions({
			fetchPublicProfile: "profile/fetchPublicProfile"
		})
	}
})
</script>

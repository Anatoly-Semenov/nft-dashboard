<template>
	<transition name="fade-in-reverse">
		<div
			class="profile__available"
			:class="{
				_loading: isLoading,
				_scroll: achievements && achievements.length > 5
			}"
			v-if="achievements && achievements.length"
		>
			<div class="profile__available-intro">
				<p class="profile__title">Available to mint</p>
				<ui-button
					v-if="isLoading || canMultiplyClaim"
					@click="onClickMintAll"
					isHighlight
					size="small"
				>
					Mint all
				</ui-button>
			</div>
			<div class="profile__available-list">
				<template v-if="isAchievements">
					<profile-achievement
						v-for="(achievement, index) in achievements"
						:key="achievement.id + achievement.status + index"
						:data="achievement"
						:loading="isLoading"
					/>
				</template>
				<profile-achievement-modal
					v-if="activeAchievements"
					:isOpen="isModal"
					:data="activeAchievements"
					@cancel="isModal = false"
				/>
			</div>
		</div>
	</transition>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import { profileMultipleMint } from "~/mixins/achievements"
import { networkMixin } from "~/mixins/web3"

// Components
const profileAchievement = () =>
	import(
		/* webpackChunkName: "profile-achievement" */ "~/components/profile/profile-achievement.vue"
	)
const profileAchievementModal = () =>
	import(
		/* webpackChunkName: "profile-achievement-modal" */ "./profile-achievement-modal.vue"
	)

// Mocks
import { profileAvailableAchievementsList as loadingList } from "~/static/mocks"

// Lodash
import _cloneDeep from "lodash/cloneDeep"

// Types
import { ProfileService } from "@nft-types"

export default mixins(profileMultipleMint, networkMixin).extend({
	name: "profile-available",
	components: {
		profileAchievement,
		profileAchievementModal
	},
	data() {
		return {
			isLoading: false,
			isModal: false as boolean,
			activeAchievements: null as null | ProfileService.ProfileAchievement[]
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchAvailableAchievements()
		await this.checkClaimedAchievements("available").catch(() => {})
		this.isLoading = false
	},
	watch: {
		async currentNetworkVersion(): Promise<void> {
			if (!this.isLoading && this.isValidNetwork) {
				this.isLoading = true
				await this.checkClaimedAchievements("available").catch(() => {})
				this.isLoading = false
			}
		}
	},
	computed: {
		...mapGetters({
			getAvailableAchievements: "profile/getAvailableAchievements"
		}),
		achievements(): ProfileService.ProfileAchievement[] {
			return this.isLoading ? loadingList : this.getAvailableAchievements
		},
		isAchievements(): boolean {
			return !!this.achievements?.length
		}
	},
	methods: {
		...mapActions({
			fetchAvailableAchievements: "profile/fetchAvailableAchievements",
			checkClaimedAchievements: "profile/checkClaimedAchievements"
		}),
		onClickMintAll(): void {
			this.activeAchievements = this.achievements.filter(
				(achievement) => achievement.status === "NOT_CLAIMED"
			)
			this.isModal = true
		}
	}
})
</script>

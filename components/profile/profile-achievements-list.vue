<template>
	<div class="profile__achievements-list" :class="`_${type}`">
		<template v-if="isAchievements">
			<profile-achievements
				v-for="(achievement, index) in achievements"
				:key="index + achievement.game.id"
				:data="achievement"
				:type="type"
				:isLoading="isLoading"
			/>
		</template>
		<ui-result
			v-else-if="isEmptyAchievements"
			size="l"
			:title="empty[type].title"
			:description="empty[type].description"
		/>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import { networkMixin } from "~/mixins/web3"

// Components
import profileAchievements from "./profile-achievements.vue"

// Mocks
import { profileAchievementsList as loadingList } from "~/static/mocks"

// Types
import type { ProfileService } from "@nft-types"
import type { PropType } from "vue"
import type { ProfileType } from "~/types"

export default mixins(networkMixin).extend({
	name: "profile-achievements-list",
	components: {
		profileAchievements
	},
	props: {
		type: {
			type: String as PropType<ProfileType>,
			default: "private"
		},
		profileId: String
	},
	data() {
		return {
			isLoading: false as boolean,
			empty: {
				private: {
					title: "No achievements available",
					description:
						"We couldn’t track any of your achievements, or we do not support your games yet. Please connect your game account(s), or email us at google@google.com, if you think something has gone wrong."
				},
				public: {
					title: "This user has no achievements",
					description:
						"We couldn’t track any of your achievements, or we do not support your games yet."
				}
			}
		}
	},
	async fetch() {
		this.fetchData()
	},
	watch: {
		async currentNetworkVersion(): Promise<void> {
			if (!this.isLoading && this.isValidNetwork) {
				this.isLoading = true
				await this.checkClaimedAchievements().catch(() => {})
				this.isLoading = false
			}
		}
	},
	computed: {
		...mapGetters({
			getAchievements: "profile/getAchievements",
			getPublicAchievements: "profile/getPublicAchievements",
			getIsEmptyAchievements: "profile/getIsEmptyAchievements",
			getIsEmptyPublicAchievements: "profile/getIsEmptyPublicAchievements"
		}),
		achievements(): ProfileService.Achievement[] {
			if (this.isLoading) {
				return loadingList
			} else if (this.type === "private") {
				return this.getAchievements
			} else if (this.type === "public") {
				return this.getPublicAchievements
			}

			return []
		},
		isAchievements(): boolean {
			return !!this.achievements?.length
		},
		isEmptyAchievements(): boolean {
			return this.type === "public"
				? this.getIsEmptyPublicAchievements
				: this.getIsEmptyAchievements
		}
	},
	methods: {
		...mapActions({
			fetchAchievements: "profile/fetchAchievements",
			fetchPublicAchievements: "profile/fetchPublicAchievements",
			checkClaimedAchievements: "profile/checkClaimedAchievements"
		}),
		async fetchData() {
			this.isLoading = true

			if (this.type === "private") {
				await this.fetchAchievements()
				await this.checkClaimedAchievements().catch(() => {})
			} else if (this.type === "public") {
				await this.fetchPublicAchievements(this.profileId)
			}

			this.isLoading = false
		}
	}
})
</script>

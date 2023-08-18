<template>
	<div
		class="profile__achievements"
		:class="{ _loading: isLoading, _public: type === 'public' }"
		v-if="achievementsList.length"
	>
		<div class="profile__achievements-header">
			<nuxt-link
				class="profile__achievements-game"
				:to="`/profile/games/${gameId}`"
			>
				<div
					class="profile__achievements-logo"
					:class="{ _empty: !logo }"
					v-if="isLoading || !logo"
				/>
				<ui-avatar
					class="profile__achievements-logo"
					:size="40"
					v-else
					:src="logo"
				/>
				<div class="profile__achievements-intro">
					<p class="profile__achievements-title">{{ gameName }}</p>
					<p class="profile__achievements-description" v-if="type === 'public'">
						{{ achievementsStats }} Achievements
					</p>
					<icon-arrow-link v-if="type === 'private'" />
				</div>
			</nuxt-link>
			<ui-tag
				class="profile__achievements-tag"
				color="#1A1A1A"
				:loading="isLoading"
				v-if="type === 'private'"
			>
				{{ achievementsStats }}
				<span>Achievements</span>
			</ui-tag>
			<div class="profile__achievements-actions" v-if="false">
				<ui-button
					v-if="isLoading || canMultiplyClaim"
					@click="mintAll"
					:loading="isLoadingButton"
				>
					Mint all
				</ui-button>
			</div>
		</div>
		<div class="profile__achievements-list">
			<profile-achievement
				v-for="(achievement, index) in achievementsList"
				:key="achievement.id + achievement.status + index"
				:data="achievement"
				:loading="isLoading"
				:type="type"
			/>
		</div>
		<button
			class="profile__achievements-more"
			:class="{ _open: isFullDisplay }"
			v-if="isMore"
			@click="isFullDisplay = !isFullDisplay"
			key="more"
		>
			Show {{ isFullDisplay ? "less" : "more" }}
			<icon-arrows-top />
		</button>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { PropType } from "vue"
import { mapGetters } from "vuex"

// Mixins
import { profileMultipleMint } from "~/mixins/achievements"

// Components
import profileAchievement from "~/components/profile/profile-achievement.vue"

// Icons
import iconArrowsTop from "~/assets/img/icons/icon-arrows-top.svg"
import iconArrowLink from "~/assets/img/icons/icon-arrow-up-right.svg"

// Types
import type { ProfileService } from "@nft-types"
import type { ProfileType } from "~/types"

export default mixins(profileMultipleMint).extend({
	name: "profile-achievements",
	components: {
		profileAchievement,
		iconArrowsTop,
		iconArrowLink
	},
	props: {
		type: {
			type: String as PropType<ProfileType>,
			default: "private"
		},
		data: {
			type: Object as PropType<ProfileService.Achievement>,
			required: true
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isFullDisplay: false as boolean
		}
	},
	computed: {
		...mapGetters({
			getLoadingIds: "nft/getLoadingIds"
		}),
		isLoadingButton(): boolean {
			return this.getLoadingIds("games", this.gameId)
		},
		isMore(): boolean {
			return (
				!this.isLoading && this.achievements && this.achievements.length > 5
			)
		},
		achievements(): ProfileService.ProfileAchievement[] {
			return this.data.achievements
		},
		totalAchievements(): number {
			// @ts-ignore
			return this.data?.total_achievements || 0
		},
		achievementsList(): ProfileService.ProfileAchievement[] {
			const isNotFull: boolean =
				!this.isFullDisplay && this.achievements.length > 5

			if (isNotFull) {
				return [
					this.achievements[0],
					this.achievements[1],
					this.achievements[2],
					this.achievements[3],
					this.achievements[4]
				]
			}

			return this.achievements
		},
		achievementsStats(): string {
			const readyToClaim: number = this.achievements?.length || 0

			return `${readyToClaim} / ${this.totalAchievements}`
		},
		logo(): string {
			return this.data.game.logo
		},
		gameName(): string {
			return this.data.game.title
		},
		gameId(): number {
			return this.data.game.id
		}
	}
})
</script>

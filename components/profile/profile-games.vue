<template>
	<div class="profile__games" :class="{ _loading: isLoading }">
		<p class="profile__games-title">All games</p>
		<div class="profile__games-list">
			<component
				:is="isLoading ? 'div' : 'transition-group'"
				class="profile__games-list"
				tag="div"
				name="slide-fade-top-reverse"
			>
				<nuxt-link
					class="profile__games-item"
					v-for="(
						{ id, title, logo, earnedAchievements, achievements }, index
					) in games"
					:key="index + title"
					:to="`/profile/games/${id}`"
				>
					<div class="profile__games-profile">
						<ui-avatar :src="logo" :size="40" />
						<div class="profile__games-text">
							<p class="profile__games-name">{{ title }}</p>
							<p class="profile__games-description">
								{{ description(earnedAchievements, achievements) }}
							</p>
						</div>
					</div>
					<icon-arrow-link />
				</nuxt-link>
			</component>
			<transition name="fade-in">
				<button
					class="profile__achievements-more"
					v-if="!isLoading"
					@click="isFullList = !isFullList"
				>
					Show {{ isFullList ? "less" : "all" }}
				</button>
			</transition>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Icons
const iconArrowLink = () =>
	import(
		/* webpackChunkName: "icon-arrow-link" */ "~/assets/img/icons/icon-arrow-up-right.svg"
	)

// Mocks
import { profileGamesPreviewList as loadingList } from "~/static/mocks"

// Types
import type { ProfileService } from "@sk-types"

export default Vue.extend({
	name: "profile-games",
	components: {
		iconArrowLink
	},
	data() {
		return {
			gamesResponse: null as null | ProfileService.GamePreviewResponse,
			isLoading: false as boolean,
			isFullList: false as boolean
		}
	},
	async fetch() {
		this.isLoading = true
		await this.fetchGames()
		this.isLoading = false
	},
	watch: {
		getIsAuth(val) {
			if (val) {
				this.$fetch()
			}
		}
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth"
		}),
		games(): ProfileService.GamePreviewResponse | null {
			if (this.isLoading) {
				return loadingList
			} else {
				return this.isFullList
					? this.gamesResponse
					: this.gamesResponse?.slice(0, 5) || null
			}
		}
	},
	methods: {
		async fetchGames() {
			await this.$profileApi
				.getGamesPreview()
				.then((data) => {
					this.gamesResponse = data
				})
				.catch((error: any) => {
					console.error(error)
				})
		},
		description(earnedAchievements: number, achievements: number): string {
			return this.getIsAuth
				? `${earnedAchievements} / ${achievements} Achievements`
				: `${achievements} Achievements`
		}
	}
})
</script>

<template>
	<div class="profile-game__achievements" :class="{ _loading: isLoading }">
		<div
			class="profile-game__achievements-block"
			v-for="({ title, type, achievements }, index) in list"
			:key="title"
		>
			<template v-if="achievements && achievements.length">
				<div class="profile-game__achievements-head">
					<p class="profile-game__achievements-title">{{ title }}</p>
					<ui-button
						@click="onClickMintAll"
						v-if="index === 0 && notClaimedGames && notClaimedGames.length"
						size="small"
						:loading="isLoadingButton"
						isHighlight
					>
						Mint all
					</ui-button>
				</div>
				<div class="profile-game__achievements-list">
					<div
						class="profile-game__achievements-item"
						:class="`_${type.toLowerCase()}`"
						v-for="(
							{ name, id, nfts, status, scores, usersEarned }, index
						) in achievements"
						:key="id + status + index"
					>
						<div class="profile-game__achievements-profile">
							<div class="profile-game__achievements-img" v-if="isLoading" />
							<img
								class="profile-game__achievements-img"
								:src="img(nfts)"
								v-else
							/>
							<div class="profile-game__achievements-text">
								<p class="profile-game__achievements-name">{{ name }}</p>
								<p
									class="profile-game__achievements-description"
									v-if="nfts.length && nfts[0].shortDescription"
								>
									{{ nfts[0].shortDescription }}
								</p>
							</div>
						</div>
						<div class="profile-game__achievements-stats">
							<ui-statistic
								isSlot
								:title="`Point${scores > 1 ? 's' : ''}`"
								size="small"
								:isLoading="isLoading"
							>
								<div class="profile-game__achievements-points">
									<icon-power />
									{{ scores }}
								</div>
							</ui-statistic>
							<ui-statistic
								title="Minted"
								tooltip="Users with this achievement"
								size="small"
								:isLoading="isLoading"
								isSlot
							>
								<div class="profile-game__achievements-user">
									<icon-user />
									{{ usersEarned || "-" }}
								</div>
							</ui-statistic>
							<div
								class="profile-game__achievements-action"
								v-if="getIsAuth && isMobile"
							>
								<ui-button
									@click="mint(achievements[index])"
									size="small"
									v-if="type === 'NOT_CLAIMED'"
								>
									Mint
								</ui-button>
								<ui-button
									@click="$message.info('Coming soon')"
									size="small"
									v-else-if="type === 'CLAIMED'"
								>
									Share
								</ui-button>
								<ui-tag v-else color="#1A1A1A">Requirements not met</ui-tag>
							</div>
						</div>
						<div
							class="profile-game__achievements-action"
							v-if="getIsAuth && !isMobile"
						>
							<ui-button
								@click="mint(achievements[index])"
								size="small"
								v-if="type === 'NOT_CLAIMED'"
							>
								Mint
							</ui-button>
							<ui-button
								@click="$message.info('Coming soon')"
								size="small"
								v-else-if="type === 'CLAIMED'"
							>
								Share
							</ui-button>
							<ui-tag v-else color="#1A1A1A">Requirements not met</ui-tag>
						</div>
					</div>
				</div>

				<profile-achievement-modal
					v-if="activeAchievements"
					:isOpen="isModal"
					:data="activeAchievements"
					@cancel="isModal = false"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Components
const profileAchievementModal = () =>
	import(
		/* webpackChunkName: "profile-achievement-modal" */ "./profile-achievement-modal.vue"
	)

// Mixins
import widthMixin from "~/mixins/width"
import { profileMultipleMint } from "~/mixins/achievements"
import { networkMixin } from "~/mixins/web3"

// Icons
const iconPower = () =>
	import(
		/* webpackChunkName: "icon-power" */ "~/assets/img/icons/icon-power.svg"
	)
const iconUser = () =>
	import(/* webpackChunkName: "icon-user" */ "~/assets/img/icons/icon-user.svg")

// Types
import type { ProfileService, NftService } from "@nft-types"

// Mocks
import { profileAchievementsGameList as loadingList } from "~/static/mocks"

export default mixins(widthMixin, profileMultipleMint, networkMixin).extend({
	name: "profile-game-achievements",
	components: {
		profileAchievementModal,
		iconPower,
		iconUser
	},
	props: {
		gameId: {
			type: [Number, String],
			required: true
		}
	},
	data() {
		return {
			isLoading: false as boolean,
			isModal: false as boolean,
			activeAchievements: null as null | ProfileService.ProfileAchievement[]
		}
	},
	async fetch() {
		this.isLoading = true
		await this.fetchGameAchievements(this.gameId)
		await this.checkClaimedAchievements("detail")
		this.isLoading = false
	},
	watch: {
		async currentNetworkVersion(): Promise<void> {
			if (!this.isLoading && this.isValidNetwork) {
				this.isLoading = true
				await this.checkClaimedAchievements("detail").catch(() => {})
				this.isLoading = false
			}
		},
		getIsAuth(val) {
			if (val) {
				this.$fetch()
			}
		}
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth",
			getLoadingIds: "nft/getLoadingIds",
			getGameAchievements: "profile/getGameAchievements"
		}),
		isLoadingButton(): boolean {
			return this.getLoadingIds("games", this.gameId)
		},
		isMobile(): boolean {
			return this.screenWidth < 800
		},
		achievements(): null | ProfileService.ProfileAchievement[] {
			return this.isLoading ? loadingList : this.getGameAchievements
		},
		claimedGames(): ProfileService.ProfileAchievement[] | null {
			return this.getAchievements("CLAIMED")
		},
		notClaimedGames(): ProfileService.ProfileAchievement[] | null {
			return this.getAchievements("NOT_CLAIMED")
		},
		disabledGames(): ProfileService.ProfileAchievement[] | null {
			return this.getAchievements("DISABLED")
		},
		list(): any {
			const list = []

			if (this.notClaimedGames?.length) {
				list.push({
					title: "Available to mint",
					type: "NOT_CLAIMED",
					achievements: this.notClaimedGames
				})
			}

			if (this.claimedGames?.length) {
				list.push({
					title: "Minted",
					type: "CLAIMED",
					achievements: this.claimedGames
				})
			}

			if (this.disabledGames?.length) {
				list.push({
					title: this.getIsAuth ? "Requirements not met" : "All achievements",
					type: "DISABLED",
					achievements: this.disabledGames
				})
			}

			return list
		}
	},
	methods: {
		...mapMutations({
			setLoading: "nft/setLoading"
		}),
		...mapActions({
			fetchGameAchievements: "profile/fetchGameAchievements",
			checkClaimedAchievements: "profile/checkClaimedAchievements",
			claim: "nft/claim"
		}),
		img(nfts: NftService.Nft[]): string {
			return nfts?.[0]?.image || require("~/assets/img/achievement-empty.png")
		},
		getAchievements(
			name: ProfileService.AchievementStatus
		): ProfileService.ProfileAchievement[] | null {
			return (
				this.achievements?.filter((item: ProfileService.ProfileAchievement) => {
					return item.status === name
				}) || null
			)
		},
		onClickMintAll(): void {
			this.activeAchievements = this.achievements!.filter(
				(achievement) => achievement.status === "NOT_CLAIMED"
			)
			this.isModal = true
		},
		mintAllNft(): void {
			if (this.isValidNetwork) {
				this.setLoading({ type: "add", name: "games", value: this.gameId })

				// @ts-ignore
				this.mintAll(Number(this.gameId))
			} else {
				this.$message.error("Not valid network")
				this.$emit("failNetwork")
			}
		},
		mint(achievement: ProfileService.ProfileAchievement): void {
			this.activeAchievements = [achievement]
			this.isModal = true
			// this.claim(achievement.nfts![0].id)
		}
	}
})
</script>

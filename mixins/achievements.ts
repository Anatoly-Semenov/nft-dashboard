import Vue, { PropOptions } from "vue"
import { mapActions } from "vuex"

// Icons
import iconPower from "~/assets/img/icons/icon-power.svg"

// Types
import type { NftService, ProfileService, GameService } from "@nft-types"
type Achievement = ProfileService.ProfileAchievement

export const profileAchievementMixin = Vue.extend({
	components: {
		iconPower
	},
	props: {
		data: Object as PropOptions<Achievement>
	},
	computed: {
		nft(): NftService.Nft | null {
			return this.data?.nfts?.[0] || null
		},
		nftId(): number | null {
			return this.nft?.id || null
		},
		img(): string {
			return this.nft?.image || require("~/assets/img/achievement-empty.png")
		},
		title(): string {
			return this.data?.name || ""
		},
		description(): string {
			return this.nft?.description || ""
		},
		points(): number {
			return this.data?.scores || 0
		},
		date(): string {
			// todo: add date
			return ""
		},
		status(): ProfileService.AchievementStatus {
			return this.data?.status || "DISABLED"
		},
		game(): GameService.Game | null {
			// @ts-ignore
			return this.data?.game || null
		},
		logo(): string {
			return this.game?.logo || ""
		},
		isClaimed(): boolean {
			return this.status === "CLAIMED"
		},
		isReadyToClaim(): boolean {
			return this.status === "NOT_CLAIMED"
		},
		isDisabled(): boolean {
			return this.status === "DISABLED"
		},
		selectorsState(): object {
			return {
				_minted: this.isClaimed,
				_ready: this.isReadyToClaim,
				_disabled: this.isDisabled,
				// @ts-ignore
				_loading: this?.loading || this?.idLoading || false
			}
		}
	}
})

export const profileMultipleMint = Vue.extend({
	computed: {
		readyToClaimNfts(): number[] {
			const nftList: number[] = []

			// @ts-ignore
			const achievements: Achievement[] = this.achievements

			if (achievements?.length) {
				achievements.forEach(({ status, nfts }) => {
					if (status === "NOT_CLAIMED") {
						// @ts-ignore
						nfts!.forEach(({ id }) => {
							nftList.push(id)
						})
					}
				})
			}

			return nftList
		},
		canMultiplyClaim(): boolean {
			return !!this.readyToClaimNfts.length
		}
	},
	methods: {
		...mapActions({
			claimMultiple: "nft/claimMultiple"
		}),
		async mintAll(
			gameID: number | number[] = 0,
			mintWallet: string
		): Promise<void> {
			if (this.readyToClaimNfts) {
				await this.claimMultiple({
					nftIds: this.readyToClaimNfts,
					gameID,
					mintWallet
				})
			} else {
				this.$message.error(
					"You don't have any achievements available to claim"
				)
			}
		}
	}
})

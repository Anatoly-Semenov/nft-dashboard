<template>
	<ui-modal
		class="profile-achievement-modal"
		:class="selectorsState"
		@cancel="$emit('cancel')"
		:value="isOpen"
		:width="isList ? null : 453"
		disableHeader
		destroyOnClose
		centered
		transparentContent
		closable
		:confirmLoading="isLoading"
		:key="currentNetworkVersion"
	>
		<div class="profile-achievement-modal__container">
			<div class="profile-achievement-modal__list">
				<profile-achievement-modal-item
					v-for="(achievement, index) in data"
					:key="index + achievement.status"
					:data="achievement"
					:isList="isList"
				/>
			</div>

			<template v-if="type === 'private'">
				<ui-input
					v-if="!isClaimed"
					title="Mint achievement(s) to the wallet"
					placeholder="Mint to wallet"
					:value="mintWallet"
					@input="mintWallet = $event"
					:disabled="isLoadingButton || !isValidNetwork"
				/>

				<div class="profile-achievement-modal__buttons">
					<ui-button
						class="profile-achievement-modal__buttons-close"
						@click="$emit('cancel')"
						v-if="isList"
					>
						Close
					</ui-button>
					<ui-button
						@click="onClickButton"
						isGradient
						:isHighlight="isClaimed"
						:loading="isLoadingButton"
						:disabled="isDisabled || !mintWallet"
						v-if="isValidNetwork"
					>
						{{ buttonText }}
					</ui-button>
					<ui-button
						v-else
						@click="changeNetwork"
						isGradient
						isHighlight
						:disabled="isDisabled"
					>
						Change network
					</ui-button>
				</div>
			</template>
		</div>
	</ui-modal>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import { networkMixin } from "~/mixins/web3"
import { profileMultipleMint } from "~/mixins/achievements"

// Components
const profileAchievementModalItem = () =>
	import(
		/* webpackChunkName: "profile-achievement-modal-item" */ "./profile-achievement-modal-item.vue"
	)

// Types
import type { PropType } from "vue"
import type { ProfileType } from "~/types"
import { ProfileService, NftService } from "@nft-types"

export default mixins(networkMixin, profileMultipleMint).extend({
	name: "profile-achievement-modal",
	components: {
		profileAchievementModalItem
	},
	props: {
		data: Array as PropType<ProfileService.ProfileAchievement[]>,
		isOpen: Boolean,
		type: {
			type: String as PropType<ProfileType>,
			default: "private"
		}
	},
	data() {
		return {
			isLoading: false as boolean,
			mintWallet: "" as string
		}
	},
	created(): void {
		this.mintWallet = this.getWalletAddress
	},
	computed: {
		...mapGetters({
			getLoadingIds: "nft/getLoadingIds",
			getWalletAddress: "auth/getWalletAddress",
			getGameId: "games/getGameId"
		}),
		achievements(): ProfileService.ProfileAchievement[] | null {
			return this.isList ? this.data : null
		},
		gameId(): number | number[] {
			const ids: number[] = []

			this.achievements!.forEach(({ game }: any) => {
				ids.push(game.id)
			})

			if (ids.length > 1) {
				return ids
			} else {
				return ids[0]
			}
		},
		isList(): boolean {
			return this.data.length > 1
		},
		achievement(): ProfileService.ProfileAchievement | null {
			return this.data[0] || null
		},
		nft(): NftService.Nft | null {
			return this.achievement?.nfts?.[0] || null
		},
		nftId(): number {
			return this.nft?.id || 0
		},
		status(): ProfileService.AchievementStatus {
			return this.achievement?.status || "DISABLED"
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
				_loading: this?.loading || this?.idLoading || false,
				_list: this.isList,
				_public: this.type === "public"
			}
		},
		isLoadingButton(): boolean {
			return this.getLoadingIds("nfts", this.nftId || 0)
		},
		buttonText(): string {
			if (this.isClaimed) {
				return "Share with friends"
			} else if (this.isList) {
				return "Mint all"
			} else {
				return "Mint"
			}
		}
	},
	methods: {
		...mapActions({
			claim: "nft/claim"
		}),
		async onClickButton(): Promise<void> {
			if (this.canMultiplyClaim && !this.isClaimed) {
				this.mintAll(this.gameId, this.mintWallet)
			} else if (this.isReadyToClaim && this.nftId && !this.isClaimed) {
				await this.claim({ nftId: this.nftId, mintWallet: this.mintWallet })
			} else {
				this.$message.info("Coming soon")
			}
		}
	}
})
</script>

<template>
	<div class="profile-achievement-modal__item">
		<img
			class="profile-achievement-modal__logo"
			v-if="!isList && logo"
			:src="logo"
		/>

		<img class="profile-achievement-modal__img" :src="img" v-if="img" />
		<div class="profile-achievement-modal__img" v-else />

		<div class="profile-achievement-modal__intro">
			<template v-if="isList">
				<p class="profile__achievement-points">
					<icon-power />
					{{ points }}
					<span>Point{{ points > 1 ? "s" : "" }}</span>
				</p>
				<p class="profile-achievement-modal__title">{{ title }}</p>
			</template>
			<template v-else>
				<p class="profile-achievement-modal__title">{{ title }}</p>
				<p class="profile__achievement-points">
					<icon-power />
					{{ points }}
					<span>Point{{ points > 1 ? "s" : "" }}</span>
				</p>
			</template>
			<p class="profile-achievement-modal__subtitle" v-if="description">
				{{ description }}
			</p>
			<p class="profile-achievement-modal__date" v-if="date">{{ date }}</p>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import { profileAchievementMixin } from "~/mixins/achievements"

export default mixins(profileAchievementMixin).extend({
	name: "profile-achievement-modal-item",
	props: {
		isList: Boolean
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
			getWalletAddress: "auth/getWalletAddress"
		}),
		isLoadingButton(): boolean {
			return this.getLoadingIds("nfts", this.nftId || 0)
		},
		buttonText(): string {
			if (this.isClaimed) {
				return "Share with friends"
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
			if (this.isReadyToClaim && this.nft) {
				await this.claim({ nftId: this.nftId, mintWallet: this.mintWallet })
			} else {
				this.$message.info("Coming soon")
			}
		}
	}
})
</script>

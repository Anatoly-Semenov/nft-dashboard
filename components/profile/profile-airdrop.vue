<template>
	<div class="profile__airdrop" v-if="isShow">
		<img class="profile__airdrop-background" :src="backgroundImage" />
		<p class="profile__airdrop-title">Request MATIC</p>
		<p class="profile__airdrop-description">
			You have the opportunity to get
			<span class="profile__airdrop-coin">1.0 MATIC</span>
			to your wallet. This is enough for your first mint achievements
		</p>
		<ui-button class="profile__airdrop-button" @click="isModal = true">
			Get MATIC
		</ui-button>

		<profile-airdrop-modal :isDisplay="isModal" @cancel="isModal = false" />
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Components
import profileAirdropModal from "~/components/profile/profile-airdrop-modal.vue"

export default Vue.extend({
	name: "profile-airdrop",
	components: {
		profileAirdropModal
	},
	data() {
		return {
			isAllowed: false as boolean,
			isModal: false as boolean
		}
	},
	mounted() {
		this.$airdropMaticApi
			.isAllowed()
			.then((data) => (this.isAllowed = data.isAllowed))
			.catch((error: any) => {
				console.error(error)
			})
	},
	computed: {
		...mapGetters({
			getWalletAddress: "auth/getWalletAddress"
		}),
		isShow(): boolean {
			return this.isAllowed && !!this.getWalletAddress
		},
		backgroundImage() {
			return require("~/assets/img/matic-cover.png")
		}
	}
})
</script>

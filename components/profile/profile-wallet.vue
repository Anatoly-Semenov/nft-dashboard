<template>
	<ui-modal
		class="profile__wallet"
		@cancel="$emit('close')"
		:value="display"
		:width="416"
		disableHeader
		disableFooter
		destroyOnClose
		centered
	>
		<div class="profile__wallet-container" v-if="type === 'new'">
			<icon-metamask />
			<p class="profile__wallet-title">{{ newWallet.title }}</p>
			<p class="profile__wallet-description">
				{{ newWallet.description }}
			</p>
		</div>
		<div class="profile__wallet-container" v-if="type === 'checking'">
			<ui-icon
				class="profile__wallet-icon"
				type="loading"
				color="var(--color-ui)"
			/>
			<p class="profile__wallet-title">{{ checking.title }}</p>
			<p class="profile__wallet-description">
				{{ checking.description }}
			</p>
		</div>
		<div class="profile__wallet-container" v-if="type === 'error'">
			<icon-info class="profile__wallet-icon _error" />
			<p class="profile__wallet-title">{{ error.title }}</p>
			<p class="profile__wallet-description">
				{{ error.description }}
			</p>
		</div>
		<div class="profile__wallet-container" v-else-if="type === 'delete'">
			<icon-trash />
			<p class="profile__wallet-title">{{ deleteWallet.title }}</p>
			<p class="profile__wallet-description">
				{{ deleteWallet.description }}
			</p>
		</div>
	</ui-modal>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Icons
import iconMetamask from "~/assets/img/icon-metamask.svg"
import iconTrash from "~/assets/img/icon-metamask.svg"
import iconInfo from "~/assets/img/icons/icon-error-info.svg"

export default Vue.extend({
	name: "profile-wallet",
	components: {
		iconMetamask,
		iconTrash,
		iconInfo
	},
	props: {
		display: Boolean,
		type: {
			type: String,
			default: "new"
		} as PropOptions<"new" | "delete" | "error" | "checking">
	},
	data() {
		return {
			newWallet: {
				title: "Add a new wallet",
				description:
					"Please add or create a new account in your Metamask. Click on your wallet icon, select the required option from the menu list."
			},
			error: {
				title: "Failed to connect new wallets",
				description: "Please try again later."
			},
			checking: {
				title: "Connectivity Check",
				description: "Please wait a moment."
			},
			delete: {
				title: "Disconnect the wallet",
				description:
					"All achievements and progress\non this wallet will be reset"
			}
		}
	}
})
</script>

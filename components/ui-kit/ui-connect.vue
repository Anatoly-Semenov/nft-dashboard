<template>
	<button
		class="ui-connect"
		:class="additionalSelectors"
		:disabled="isDisabled"
		@click="throttleLogin"
	>
		<ui-jazzicon
			class="ui-connect__avatar"
			v-if="isJazzIcon"
			:address="user.walletAddress"
			:diameter="30"
		/>
		<div class="ui-connect__loading" v-else-if="isLoading" />

		<icon-phantom class="ui-connect__icon" v-if="isIcon('solana')" />
		<icon-discord class="ui-connect__icon" v-if="isIcon('discord')" />
		<icon-twitter class="ui-connect__icon" v-if="isIcon('twitter')" />

		<span class="ui-connect__label">{{ label }}</span>
	</button>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { PropOptions } from "vue"

// Mixins
import connectMixin from "~/mixins/connect"

// Types
import { UserService } from "@sk-types"

// Icons
const iconDiscord = () =>
	import(
		/* webpackChunkName: "icon-discord" */ "~/assets/img/icons/social/icon-discord.svg"
	)
const iconTwitter = () =>
	import(
		/* webpackChunkName: "icon-twitter" */ "~/assets/img/icons/social/icon-twitter.svg"
	)
const iconPhantom = () =>
	import(
		/* webpackChunkName: "icon-phantom" */ "~/assets/img/icons/icon-phantom.svg"
	)

// Lodash
import _debounce from "lodash/debounce"

// Types
import { UiConnectType } from "~/types/ui-kit/ui-connect"
import { mapGetters } from "vuex"

export default mixins(connectMixin).extend({
	name: "ui-button-connect",
	components: {
		iconDiscord,
		iconTwitter,
		iconPhantom
	},
	props: {
		title: String,
		type: {
			type: String,
			default: "wallet"
		} as PropOptions<UiConnectType>,
		isHighlight: Boolean,
		isConnectOnly: Boolean
	},
	computed: {
		...mapGetters({
			getIsSolanaAuth: "auth/getIsSolanaAuth"
		}),
		defaultTitle(): string {
			switch (this.type) {
				case "solana":
					return "Connect Phantom"
				case "discord":
					return "Add Discord"
				case "twitter":
					return "Add Twitter"
				case "steam":
					return "Add Steam"
				case "epicGames":
					return "Epic Games"
				default:
					return "Connect wallet"
			}
		},
		label(): string {
			let data = ""

			const social = this.user?.[this.type] as
				| UserService.SocialProfile
				| undefined

			// Set authorized data
			switch (this.type) {
				case "solana":
					data = this.user?.solanaAccount
						? this.$shortWallet(this.user.solanaAccount)
						: "Undefined user"
					break
				case "discord":
					if (social) data = social.name || "Undefined user"
					break
				case "twitter":
					if (social) data = social.name || "Undefined user"
					break
				case "steam":
					if (social) data = social.name || "Undefined user"
					break
				case "epicGames":
					if (this.isConnected) {
						data = ""
					}
					break
				default:
					if (this.user?.walletAddress) {
						data = this.$shortWallet(this.user.walletAddress)
					}
					break
			}

			// Set unauthorized data
			if (!data) {
				this.title ? (data = this.title) : (data = this.defaultTitle)
			}

			return data
		},
		isConnected(): boolean {
			switch (this.type) {
				case "solana":
					return this.getIsSolanaAuth
				case "discord":
					return !!this.user?.discord?.id
				case "twitter":
					return !!this.user?.twitter?.id
				case "steam":
					return !!this.user?.steam?.id
				case "epicGames":
					return !!this.user?.epicGames?.id
				default:
					return !!this.user?.walletAddress
			}
		},
		isDisabled(): boolean {
			return this.type === "wallet" && !!this.user.walletAddress
		},
		isJazzIcon(): boolean {
			return (
				this.type === "wallet" && this.user.walletAddress && !this.isLoading
			)
		},
		throttleLogin(): () => void {
			const login = _debounce(() => this.loginUser(), 250, {
				maxWait: 1000
			})

			return login
		},
		additionalSelectors(): any {
			return {
				_loading: this.isLoading,
				_connected: this.isConnected,
				_highlight: this.isHighlight,
				[`_${this.type}`]: true
			}
		}
	},
	methods: {
		async loginUser(): Promise<void> {
			if (!this.isConnected) {
				if (this.type === "wallet") {
					await this.metamaskAuth()
				} else {
					this.auth(this.type, this.isConnectOnly)
				}
			}
		},
		isIcon(name: UiConnectType): boolean {
			return !this.isLoading && this.isConnected && this.type === name
		}
	}
})
</script>

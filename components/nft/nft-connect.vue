<template>
	<div class="nft__connect">
		<p class="nft__connect-title">
			Create an account to start claiming rewards
		</p>
		<div class="nft__connect-list">
			<div
				class="nft__connect-item"
				v-for="(
					{ text, connected, disabled, type, connectText }, index
				) in items"
				:key="index"
				:class="{ _connected: connected, _disabled: disabled }"
			>
				<p class="nft__connect-text">
					<ui-icon
						:type="connected ? 'check-circle' : 'close-circle'"
						theme="filled"
						:color="connected ? 'var(--color-ui)' : 'var(--color-border-hover)'"
					/>
					{{ index + 1 }}. {{ text }}
				</p>
				<ui-connect :type="type" :title="connectText" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Types
import { UiConnectType } from "~/types/ui-kit/ui-connect"
interface ConnectItem {
	text: string
	connected: boolean
	disabled: boolean
	type: string
	connectText: null | string
}

export default Vue.extend({
	name: "nft-connect",
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			user: "auth/getUser"
		}),
		items(): ConnectItem[] {
			return [
				{
					text: "Connect wallet",
					connected: this.isConnectedCheck("wallet"),
					disabled: false,
					type: "wallet",
					connectText: null
				},
				{
					text: "Connect discord",
					connected: this.isConnectedCheck("discord"),
					disabled: !this.isConnectedCheck("wallet"),
					type: "discord",
					connectText: null
				},
				{
					text: "Connect twitter",
					connected: this.isConnectedCheck("twitter"),
					disabled: !this.isConnectedCheck("wallet"),
					type: "twitter",
					connectText: null
				},
				{
					text: "Claim reward",
					connected: false,
					disabled: this.isClaim,
					type: "discord",
					connectText: "Claim"
				}
			]
		},
		isClaim(): boolean {
			return (
				!this.isConnectedCheck("wallet") &&
				!this.isConnectedCheck("discord") &&
				!this.isConnectedCheck("twitter")
			)
		}
	},
	methods: {
		isConnectedCheck(name: UiConnectType): boolean {
			switch (name) {
				case "discord":
					return !!this.user?.discord?.name
				case "twitter":
					return !!this.user?.twitter?.name
				default:
					return !!this.user?.walletAddress
			}
		}
	}
})
</script>

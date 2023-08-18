<template>
	<div class="login__block">
		<p class="login__block-title" v-if="title">{{ title }}</p>
		<p class="login__block-description" v-if="description">
			{{ description }}
		</p>
		<div class="login__block-buttons">
			<button
				class="login__block-button"
				v-for="({ logo, text, action }, index) in buttons"
				:class="{ _loading: loadingIndex === index }"
				:disabled="typeof loadingIndex === 'number'"
				:key="index"
				@click="action"
			>
				{{ text }}
				<img :src="logo" />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import connectMixin from "~/mixins/connect"

// Lodash
import _debounce from "lodash/debounce"

// Types
import type { UiConnectType } from "~/types/ui-kit/ui-connect"
interface Button {
	logo: string
	text: string
	action: () => void
}

export default mixins(connectMixin).extend({
	name: "login-block",
	data() {
		return {
			title: "Connect to SkillLabs",
			description:
				"By connecting your wallet, you agree to our terms of Service and our Privacy Policy.",
			loadingIndex: null as number | null
		}
	},
	computed: {
		buttons(): Button[] {
			const phantomAuth = _debounce(() => this.phantomAuth(), 250, {
				maxWait: 1000
			})
			const auth = (service: UiConnectType) => this.auth(service)

			const buttons: Button[] = [
				{
					logo: require("~/assets/img/auth-logo-metamask.png"),
					text: "Metamask",
					action: async () => {
						this.loadingIndex = 0
						await this.metamaskAuth()
						this.loadingIndex = null
					}
				},
				{
					logo: require("~/assets/img/auth-connect-phantom.png"),
					text: "Phantom",
					action: () => {
						this.$message.info("Coming soon")

						// Todo: temporary hide
						// phantomAuth()
					}
				},
				{
					logo: require("~/assets/img/auth-logo-steam.png"),
					text: "Steam",
					action: () => {
						this.$message.info("Coming soon")

						// Todo: temporary hide
						// auth("steam")
					}
				},
				{
					logo: require("~/assets/img/auth-logo-epicgames.png"),
					text: "Epic Games",
					action: () => {
						this.$message.info("Coming soon")

						// Todo: temporary hide
						// auth("epicGames")
					}
				}
			]

			return buttons
		}
	}
})
</script>

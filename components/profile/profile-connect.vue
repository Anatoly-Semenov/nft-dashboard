<template>
	<div
		class="profile__connect"
		:class="{
			_fullscreen: isFullscreen
		}"
	>
		<div class="profile__connect-background">
			<img class="profile__connect-img" :src="data.img" />
			<div class="profile__connect-gradient"></div>
		</div>
		<p class="profile__connect-title">
			{{ data.header }}
		</p>
		<p class="profile__connect-description" v-html="data.description" />
		<button @click="data.action" class="profile__connect-button">
			{{ data.button }}
		</button>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import connectMixin from "~/mixins/connect"

// Types
interface NetworkInfo {
	header: string
	description: string
	button: string
	img: string
	action: () => void
}

import type { PropType } from "vue"

type Type = "metamask" | "steam" | "epicgames" | "join"

const METAMASK = "metamask"
const STEAM = "steam"
const EPICGAMES = "epicgames"
const JOIN = "join"

export default mixins(connectMixin).extend({
	name: "profile-connect",
	props: {
		type: {
			type: String as PropType<Type>,
			default: "join",
			validator: function (value: string): boolean {
				return [METAMASK, STEAM, EPICGAMES, JOIN].includes(value)
			}
		},
		isFullscreen: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		data(): NetworkInfo {
			return this.info[this.type]
		},
		info(): { [key: string]: NetworkInfo } {
			return {
				metamask: {
					header: "MetaMask",
					description:
						"Track your web3 games and start <br> minting your achievements as NFTs.",
					button: "Connect MetaMask",
					img: require("~/assets/img/profile-connect-metamask.png"),
					action: () => this.metamaskAuth()
				},
				epicgames: {
					header: "Epic Games",
					description:
						'Connect your <span class="profile__connect-type">Epic Games</span> to start <br> claiming your Fortnite achievements.',
					button: "Connect Epic Games",
					img: require("~/assets/img/profile-connect-epic-games.png"),
					action: () => this.auth.call(this, "epicGames", true)
				},
				steam: {
					header: "Steam",
					description:
						'Connect <span class="profile__connect-type">Steam</span> account to start <br> claiming your Steam achievements.',
					button: "Connect Steam",
					img: require("~/assets/img/profile-connect-steam.png"),
					action: () => this.auth.call(this, "steam", true)
				},
				join: {
					header: "Join ...",
					description:
						"Connect your accounts and get unique achievements. Share with your friends, play and enjoy the game world.",
					button: "Connect to Metamask",
					img: require("~/assets/img/profile-connect-metamask.png"),
					action: () => this.metamaskAuth()
				}
			}
		}
	}
})
</script>

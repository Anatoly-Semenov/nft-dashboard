<template>
	<transition name="fade-in-reverse">
		<div class="profile__phantom" v-if="!isSolanaConnected">
			<img class="profile__phantom-background" :src="backgroundImage" />
			<p class="profile__phantom-title">Phantom wallet</p>
			<p class="profile__phantom-description">
				Add your Phantom wallet for achievements in Solana games
			</p>
			<ui-button
				class="profile__phantom-button"
				@click="onClickButton"
				:loading="isLoading"
			>
				Connect Phantom
			</ui-button>
		</div>
	</transition>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import connectMixin from "~/mixins/connect"

// Lodash
import _debounce from "lodash/debounce"
import { mapActions, mapGetters } from "vuex"

export default mixins(connectMixin).extend({
	name: "profile-phantom",
	created() {
		this.isSolanaConnected = this.getIsSolanaAuth
	},
	watch: {
		getIsSolanaAuth(newVal) {
			this.isSolanaConnected = newVal
		}
	},
	computed: {
		...mapGetters({
			getIsSolanaAuth: "auth/getIsSolanaAuth"
		}),
		backgroundImage() {
			return require("~/assets/img/phantom-background.png")
		}
	},
	methods: {
		...mapActions({
			fetchCurrentUser: "auth/fetchCurrentUser"
		}),
		onClickButton(): void {
			const phantomConnect = _debounce(() => this.connectPhantom(), 250, {
				maxWait: 1000
			})

			phantomConnect()
		},
		async connectPhantom(): Promise<void> {
			await this.phantomConnect()

			if (!this.isSolanaConnected) {
				this.fetchCurrentUser()
			}
		}
	}
})
</script>

import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Types
import { UiConnectType } from "~/types/ui-kit/ui-connect"

export default Vue.extend({
	data() {
		return {
			isLoading: false as boolean,
			isSolanaConnected: false as boolean
		}
	},
	computed: {
		...mapGetters({
			user: "auth/getUser",
			redirectUrl: "auth/getRedirectUrl"
		})
	},
	methods: {
		...mapActions({
			fetchWalletAddress: "auth/fetchWalletAddress",
			authUser: "auth/authUser",
			updateUser: "auth/updateUser"
		}),
		async auth(service: UiConnectType, isConnectOnly?: boolean): Promise<void> {
			const path = service === "epicGames" ? "epic-games" : service

			if (path === "twitter") {
				window.location.href = `${process.env.BASE_API_URL}users/socials/${path}?userId=${this.user.id}&redirectUrl=${window.location.href}`
			} else {
				this.$cookies.set("auth-redirect-url", this.$route.path)

				try {
					if (isConnectOnly) {
						await this.$userApi.getCurrent()

						this.$cookies.set(
							"social-connect-only",
							JSON.stringify(isConnectOnly)
						)
					}

					window.location.href = `${process.env.BASE_API_URL}auth/${path}`
				} catch (error) {
					this.$logout()
				}
			}
		},
		async metamaskAuth(): Promise<void> {
			this.isLoading = true

			try {
				const wallet = await this.fetchWalletAddress()

				if (wallet) {
					if (!this.user?.id && !this.user?.walletAddress) {
						await this.authUser({ walletAddress: wallet })
					} else {
						await this.updateUser({ walletAddress: wallet })
					}
				}
			} catch (error: any) {
				this.$message.error(error?.response?.data?.message || error.message)
			}

			this.isLoading = false
		},
		async phantomAuth(): Promise<void> {
			this.isLoading = true

			const solanaAccount = await this.$phantom.connect()

			if (solanaAccount) {
				try {
					const nonce = await this.$authApi.createNonce({
						// @ts-ignore
						solanaAccount
					})

					const solanaSignature = await this.$phantom.signMessage(
						`I am signing my one-time nonce: ${nonce.nonce}`
					)

					await this.authUser({
						solanaAccount,
						solanaSignature: Array.from(solanaSignature.signature)
					})
				} catch (error: any) {
					this.$message.error("Phantom wallet is not installed")
				}
			} else {
				this.$message.error("Phantom wallet is not installed")
			}

			this.isLoading = false
		},
		async phantomConnect(): Promise<void> {
			this.isLoading = true
			const account = await this.$phantom.connect()

			if (account) {
				try {
					const { nonce } = await this.$userApi.createNonce()

					const signature = await this.$phantom.signMessage(nonce)

					const { result } = await this.$userApi.connectSolanaAccount(
						account,
						Array.from(signature.signature)
					)

					this.isSolanaConnected = result
				} catch (error) {
					console.error(error)
					this.$message.error("Failed to connect phantom wallet")
				}
			} else {
				this.$message.error("Phantom wallet is not installed")
			}

			this.isLoading = false
		}
	}
})

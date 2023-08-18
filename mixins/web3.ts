import Vue from "vue"
import { mapActions, mapGetters, mapMutations } from "vuex"

import { message } from "ant-design-vue"

export const listenMetamaskEventsMixin = Vue.extend({
	mounted(): void {
		this.listenWeb3Events()
		this.listenContractEvents()
	},
	computed: {
		...mapGetters({
			getIsAddableMode: "auth/getIsAddableMode",
			getIsAuth: "auth/getIsAuth",
			getWalletAddress: "auth/getWalletAddress"
		})
	},
	methods: {
		...mapMutations({
			setLoading: "nft/setLoading",
			setAchievementStatus: "profile/setAchievementStatus",
			setActiveNftId: "nft/setActiveNftId"
		}),
		...mapActions({
			addWallet: "auth/addWallet",
			fetchWalletAddress: "auth/fetchWalletAddress",
			accountsChanged: "auth/accountsChanged"
		}),
		listenWeb3Events(): void {
			window.ethereum.on("accountsChanged", async (accounts: string[]) => {
				if (accounts.length === 0) {
					await this.$logout()
				}

				if (this.getIsAddableMode) {
					await this.addWallet(accounts[0])
				} else if (this.getWalletAddress !== accounts[0]) {
					const wallet = await this.fetchWalletAddress()
					await this.accountsChanged(wallet)
				}
			})

			window.ethereum.on("connect", (val: any) => {
				this.$nuxt.$emit("connect", val)
			})

			window.ethereum.on("disconnect", (val: any) => {
				this.$nuxt.$emit("disconnect", val)
			})

			window.ethereum.on("message", (val: any) => {
				this.$nuxt.$emit("message", val)
			})

			window.ethereum.on("chainChanged", async (val: any) => {
				this.$nuxt.$emit("chainChanged", val)
			})
		},
		listenContractEvents(): void {
			if (this.$nftContractSocket) {
				this.$nftContractSocket.events
					// eslint-disable-next-line new-cap
					.AchievementsMintedByHolder({
						filter: { _fromGameAccount: this.getWalletAddress }
					})
					.on("data", async (data: any) => {
						const { _gameId = 0, _achievementTypeId = 0 } = data.returnValues

						if (
							data.event === "AchievementsMintedByHolder" &&
							_gameId &&
							_achievementTypeId
						) {
							this.setLoading({
								type: "delete",
								name: "games",
								value: _gameId
							})

							this.setLoading({
								type: "delete",
								name: "nfts",
								value: _achievementTypeId
							})

							this.setAchievementStatus(_achievementTypeId)

							this.setActiveNftId(null)

							message.success("NFT successful claim")
						}
					})
			}
		}
	}
})

export const networkMixin = Vue.extend({
	data() {
		return {
			isMounted: false as boolean,
			isChangeNetworkProcess: false as boolean,
			currentNetworkVersion: null as null | string,
			contractNetworkVersion: null as null | string,
			chainId: null as null | string
		}
	},
	mounted() {
		window.setTimeout(() => {
			this.currentNetworkVersion = this.$web3.utils.toHex(
				this.$metamask.getCurrentNetwork()
			)

			this.contractNetworkVersion = this.$web3.utils.toHex(
				process.env.NETWORK_VERSION!
			)

			this.chainId = this.$web3.utils.toHex(this.contractNetworkVersion!)
		}, 800)
	},
	beforeUpdate() {
		this.isMounted = true
		window.setTimeout(() => {
			this.listenChainChanged()
		}, 1000)
	},
	beforeDestroy() {
		this.stopListenChainChanged()
	},
	computed: {
		isValidNetwork(): boolean {
			return this.contractNetworkVersion === this.currentNetworkVersion
		},
		canChangeNetwork(): boolean {
			return (
				this.isMounted &&
				!this.isChangeNetworkProcess &&
				!!window.ethereum &&
				this.currentNetworkVersion !== this.contractNetworkVersion
			)
		}
	},
	methods: {
		async changeNetwork(): Promise<void> {
			if (this.canChangeNetwork) {
				this.isChangeNetworkProcess = true

				await this.$metamask.changeNetwork()

				this.isChangeNetworkProcess = false
			}
		},
		listenChainChanged() {
			this.$nuxt.$on("chainChanged", (val: string) => {
				this.currentNetworkVersion = val
			})
		},
		stopListenChainChanged() {
			this.$nuxt.$off("chainChanged")
		}
	}
})

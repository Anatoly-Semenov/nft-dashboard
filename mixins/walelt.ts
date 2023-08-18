import Vue from "vue"
import { mapGetters } from "vuex"

// Components
const profileWallet = () =>
	import(
		/* webpackChunkName: "profile-wallet */ "~/components/profile/profile-wallet.vue"
	)

export default Vue.extend({
	components: {
		profileWallet
	},
	data() {
		return {
			profileWallet: {
				type: "new" as "new" | "checking" | "error",
				isDisplay: false
			}
		}
	},
	computed: {
		...mapGetters({
			wallets: "auth/getWallets"
		})
	},
	methods: {
		async addWallet(): Promise<void> {
			this.profileWallet.type = "new"
			this.profileWallet.isDisplay = true

			const walletsLength = this.wallets.length

			try {
				await this.openMetamask()

				this.profileWallet.type = "checking"

				await window.setTimeout(() => {
					if (walletsLength === this.wallets.length) {
						this.profileWallet.type = "error"
					} else {
						this.profileWallet.isDisplay = false
					}
				}, 3000)
			} catch {
				this.profileWallet.type = "error"
			}
		},
		async openMetamask(): Promise<void> {
			await window.ethereum
				.request({
					method: "wallet_requestPermissions",
					params: [
						{
							eth_accounts: {}
						}
					]
				})
				.catch((error: any) => {
					console.error(error)
				})
		}
	}
})

import { Plugin } from "@nuxt/types"

// Types
interface Metamask {
	getCurrentNetwork: () => string
	changeNetwork: (chainIdParam?: string | null) => Promise<void>
	addNetwork: () => Promise<void>
}

declare global {
	interface Window {
		ethereum: any
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$metamask: Metamask
	}
}

declare module "@nuxt/types" {
	interface NuxtAppOptions {
		$metamask: Metamask
	}

	interface Context {
		$metamask: Metamask
	}
}

declare module "vuex/types/index" {
	interface Store<S> {
		$metamask: Metamask
	}
}

const metamaskPlugin: Plugin = ({ store, app, $web3 }, inject) => {
	const metamask: Metamask = {
		getCurrentNetwork(): string {
			return window.ethereum.networkVersion
		},
		async changeNetwork(chainIdParam) {
			let chainId: string

			if (chainIdParam) {
				chainId = chainIdParam
			} else {
				const contractNetworkVersion = $web3.utils.toHex(
					process.env.NETWORK_VERSION!
				)

				chainId = $web3.utils.toHex(contractNetworkVersion!)
			}

			await window.ethereum
				.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: chainId }]
				})
				.catch(async (error: any) => {
					console.log(error)

					await this.addNetwork()
				})
		},
		async addNetwork() {
			await window.ethereum
				.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: 137,
							chainName: "Polygon Mainnet",
							nativeCurrency: {
								name: "Matic Token",
								symbol: "MATIC",
								decimals: 18
							},
							rpcUrls: ["https://polygon-rpc.com"],
							blockExplorerUrls: ["https://polygonscan.com"]
						}
					]
				})
				.catch((error: any) => {
					console.log(error)
				})
		}
	}

	inject("metamask", metamask)
}

export default metamaskPlugin

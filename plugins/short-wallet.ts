import { Plugin } from "@nuxt/types"

declare module "vue/types/vue" {
	// this.$shortWallet inside Vue components
	interface Vue {
		$shortWallet(wallet: string): string
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$shortWallet inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$shortWallet(wallet: string): string
	}
	// nuxtContext.$shortWallet
	interface Context {
		$shortWallet(wallet: string): string
	}
}

declare module "vuex/types/index" {
	// this.$shortWallet inside Vuex stores
	interface Store<S> {
		$shortWallet(wallet: string): string
	}
}

const shortWalletPlugin: Plugin = (context, inject) => {
	const shortWallet = (wallet: string): string => {
		const walletStart = wallet.substr(0, 5)
		const walletEnd = wallet.substr(wallet.length - 5, wallet.length)

		return `${walletStart}...${walletEnd}`
	}

	inject("shortWallet", shortWallet)
}

export default shortWalletPlugin

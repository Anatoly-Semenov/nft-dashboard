import type { Plugin } from "@nuxt/types"

// Service
import PhantomService from "~/services/phantom-service"

// Types
interface Phantom {
	connectWallet: () => Promise<void>
	getProvider: () => any
}

declare global {
	interface Window {
		phantom: any
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$phantom: PhantomService
	}
}

declare module "@nuxt/types" {
	interface NuxtAppOptions {
		$phantom: PhantomService
	}

	interface Context {
		$phantom: PhantomService
	}
}

declare module "vuex/types/index" {
	interface Store<S> {
		$phantom: PhantomService
	}
}

const phantomPlugin: Plugin = ({ store, app, $web3 }, inject) => {
	const phantom = () => {
		return new PhantomService()
	}

	inject("phantom", phantom())
}

export default phantomPlugin

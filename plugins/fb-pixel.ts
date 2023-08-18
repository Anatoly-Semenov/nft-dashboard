// THIS PLUGIN IS FOR TYPING ONLY
import { Plugin } from "@nuxt/types"

interface FbPixel {
	track(event: string): void
}

declare module "vue/types/vue" {
	// this.$fb inside Vue components
	interface Vue {
		$fb: FbPixel
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$fb inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$fb: FbPixel
	}
	// nuxtContext.$fb
	interface Context {
		$fb: FbPixel
	}
}

declare module "vuex/types/index" {
	// this.$fb inside Vuex stores
	interface Store<S> {
		$fb: FbPixel
	}
}

const fbPixelPlugin: Plugin = ({ $fb }, inject) => {}

export default fbPixelPlugin

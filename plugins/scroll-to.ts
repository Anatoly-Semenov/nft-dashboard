import { Plugin } from "@nuxt/types"

declare module "vue/types/vue" {
	// this.$scrollTo inside Vue components
	interface Vue {
		$scrollTo(payload?: ScrollToOptions): void
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$scrollTo inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$scrollTo(payload?: ScrollToOptions): void
	}
	// nuxtContext.$scrollTo
	interface Context {
		$scrollTo(payload?: ScrollToOptions): void
	}
}

declare module "vuex/types/index" {
	// this.$scrollTo inside Vuex stores
	interface Store<S> {
		$scrollTo(payload?: ScrollToOptions): void
	}
}

const scrollToPlugin: Plugin = (context, inject) => {
	const scrollTo = (
		payload = { top: 0, behavior: "smooth" } as ScrollToOptions
	): void => {
		window.scroll(payload)
	}

	inject("scrollTo", scrollTo)
}

export default scrollToPlugin

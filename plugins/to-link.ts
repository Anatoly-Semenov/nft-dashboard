import { Plugin } from "@nuxt/types"

declare module "vue/types/vue" {
	// this.$toLink inside Vue components
	interface Vue {
		$toLink(link: string): void
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$toLink inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$toLink(link: string): void
	}
	// nuxtContext.$toLink
	interface Context {
		$toLink(link: string): void
	}
}

declare module "vuex/types/index" {
	// this.$toLink inside Vuex stores
	interface Store<S> {
		$toLink(link: string): void
	}
}

const toLinkPlugin: Plugin = (context, inject) => {
	const toLink = (link: string): void => {
		if (link) window.open(link, "_blank")!.focus()
	}

	inject("toLink", toLink)
}

export default toLinkPlugin

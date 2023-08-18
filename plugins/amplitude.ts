import { Plugin } from "@nuxt/types"

import AmplitudeSerice from "~/services/amplitude-serice"

declare module "vue/types/vue" {
	// this.$amplitude inside Vue components
	interface Vue {
		$amplitude: AmplitudeSerice
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$amplitude inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$amplitude: AmplitudeSerice
	}
	// nuxtContext.$amplitude
	interface Context {
		$amplitude: AmplitudeSerice
	}
}

declare module "vuex/types/index" {
	// this.$amplitude inside Vuex stores
	interface Store<S> {
		$amplitude: AmplitudeSerice
	}
}

const amplitudePlugin: Plugin = ({ $amplitude }, inject) => {
	const amplitude = () => {
		return new AmplitudeSerice(
			process.env.AMPLITUDE_KEY!,
			process.env.NODE_ENV === "development"
		)
	}

	inject("amplitude", amplitude())
}

export default amplitudePlugin

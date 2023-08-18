import { message } from "ant-design-vue"
import { Plugin } from "@nuxt/types"

declare module "vue/types/vue" {
	// this.$copy inside Vue components
	interface Vue {
		$copy(text: string): void
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$copy inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$copy(text: string): void
	}
	// nuxtContext.$copy
	interface Context {
		$copy(text: string): void
	}
}

declare module "vuex/types/index" {
	// this.$copy inside Vuex stores
	interface Store<S> {
		$copy(text: string): void
	}
}

const copyPlugin: Plugin = ({ $copy }, inject) => {
	const copy = (text: string) => {
		navigator.clipboard
			.readText()
			.then((navigator_text) => {
				if (navigator_text !== text) {
					navigator.clipboard
						.writeText(text)
						.then(() => {
							// @ts-ignore
							message.success(`${text} is copied`)
						})
						.catch(() => {
							// @ts-ignore
							message.error(
								"The browser does not have permission to write the clipboard"
							)
						})
				} else {
					// @ts-ignore
					message.warning(`${text} has already been copied`)
				}
			})
			.catch(() => {
				// @ts-ignore
				message.error(
					"The browser does not have permission to write the clipboard"
				)
			})
	}
	inject("copy", copy)
}

export default copyPlugin

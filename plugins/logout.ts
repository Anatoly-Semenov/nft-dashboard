import { message } from "ant-design-vue"
import { Plugin } from "@nuxt/types"

declare module "vue/types/vue" {
	// this.$logout inside Vue components
	interface Vue {
		$logout(): Promise<void>
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$logout inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$logout(): Promise<void>
	}
	// nuxtContext.$logout
	interface Context {
		$logout(): Promise<void>
	}
}

declare module "vuex/types/index" {
	// this.$logout inside Vuex stores
	interface Store<S> {
		$logout(): Promise<void>
	}
}

const logoutPlugin: Plugin = (
	{ $logout, app, store, $cookies, redirect, route },
	inject
) => {
	const logout = async () => {
		const loginRedirectLink = route.path
		const redirectLink = "/login"

		if (redirectLink) redirect(redirectLink)

		$cookies.remove("accessToken")
		store.commit("auth/clearUserData")
		store.commit("auth/setAccessToken", "")

		store.dispatch("resetStore")

		store.commit("auth/setRedirectUrl", loginRedirectLink)
	}
	inject("logout", logout)
}

export default logoutPlugin

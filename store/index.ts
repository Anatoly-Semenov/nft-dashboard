import { ActionTree } from "vuex"

export const actions: ActionTree<null, null> = {
	async nuxtServerInit({ commit }, { app, store }) {
		const token = app.$cookies.get("accessToken")

		if (token && !store.state.auth.user?.id) {
			try {
				const user = await app.$userApi.getCurrent()
				commit("auth/setAccessToken", token)
				commit("auth/setUserData", user)
			} catch (e) {
				commit("auth/setAccessToken", "")
				app.$cookies.remove("accessToken")
			}
		}
	},

	resetStore({ commit }) {
		commit("auth/reset")
		commit("profile/reset")
		commit("nft/reset")
		commit("crm/reset")
		commit("games-charts/reset")
	}
}

import { Context } from "@nuxt/types"

export default async function ({ store, app, redirect }: Context) {
	const user = store.state.auth.user

	if (!user.id) {
		store.commit("auth/clearUserData")
		app.$message.error("Please connect wallet to access this page")
		return redirect("/login")
	}
}

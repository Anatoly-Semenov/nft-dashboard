import { Context } from "@nuxt/types"

export default async function ({ store, app }: Context) {
	const user = store.state.auth.user

	if (user?.id) {
		// return app.router!.go(-1)
		return app.router!.push("/profile")
	}
}

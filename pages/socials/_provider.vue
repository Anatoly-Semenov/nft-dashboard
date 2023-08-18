<template>
	<div></div>
</template>

<script lang="ts">
import Vue from "vue"
import HttpStatus from "http-status-codes"

export default Vue.extend({
	name: "page-nft",
	layout: "index",

	async asyncData({ query, store, app, params, redirect }) {
		const redirectUrl = app.$cookies.get("auth-redirect-url")
		const isConnectOnly = app.$cookies.get("social-connect-only")
		const { provider } = params
		let error = null

		try {
			if (query && provider) {
				const user = store.state.auth.user

				if (user?.id) {
					await store.dispatch("auth/connectSocialAccount", {
						provider,
						params: query
					})
				} else if (!isConnectOnly) {
					await store.dispatch("auth/authUserBySocial", {
						provider,
						params: query
					})
				}
			}
		} catch (e: any) {
			if (e?.response?.status !== HttpStatus.UNAUTHORIZED) {
				error = e.response.data.message || e.message
			}
		}

		if (redirectUrl) {
			app.$cookies.remove("auth-redirect-url")
		}

		if (error) {
			app.$cookies.set("error-message", error)
		}

		app.$cookies.remove("social-connect-only")
		redirect(redirectUrl || "/")
	}
})
</script>

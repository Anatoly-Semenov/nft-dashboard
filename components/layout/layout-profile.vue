<template>
	<div class="layout__profile">
		<template v-if="isPublicPage">
			<template v-if="isNotDesktop">
				<profile-public />
				<profile-connect v-if="!getIsAuth" />
				<slot />
			</template>
			<template v-else>
				<profile-public />
				<transition name="fade-in-reverse">
					<profile-connect v-if="!getIsAuth" />
				</transition>
			</template>
		</template>
		<client-only v-else>
			<profile-connect-list v-if="isNotDesktop" />
			<profile-main />
			<profile-share />
			<profile-phantom />
			<profile-airdrop />
			<profile-referral />
			<slot v-if="isNotDesktop" />
			<profile-games />
			<profile-about />
		</client-only>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Components
const profileMain = () =>
	import(
		/* webpackChunkName: "profile-main" */ "~/components/profile/profile-main.vue"
	)
const profileShare = () =>
	import(
		/* webpackChunkName: "profile-share" */ "~/components/profile/profile-share.vue"
	)
const profileReferral = () =>
	import(
		/* webpackChunkName: "profile-referral" */ "~/components/profile/profile-referral.vue"
	)
const profileConnect = () =>
	import(
		/* webpackChunkName: "profile-connect" */ "~/components/profile/profile-connect.vue"
	)
const profilePublic = () =>
	import(
		/* webpackChunkName: "profile-public" */ "~/components/profile/profile-public.vue"
	)
const profileGames = () =>
	import(
		/* webpackChunkName: "profile-games" */ "~/components/profile/profile-games.vue"
	)
const profileAbout = () =>
	import(
		/* webpackChunkName: "profile-about" */ "~/components/profile/profile-about.vue"
	)
const profileConnectList = () =>
	import(
		/* webpackChunkName: "profile-connect-list" */ "~/components/profile/profile-connect-list.vue"
	)
const profilePhantom = () =>
	import(
		/* webpackChunkName: "profile-phantom" */ "~/components/profile/profile-phantom.vue"
	)
const profileAirdrop = () =>
	import(
		/* webpackChunkName: "profile-airdrop" */ "~/components/profile/profile-airdrop.vue"
	)

export default Vue.extend({
	name: "layout-profile",
	props: {
		isNotDesktop: Boolean
	},
	components: {
		profileMain,
		profileShare,
		profileReferral,
		profilePublic,
		profileGames,
		profileAbout,
		profileConnectList,
		profileConnect,
		profilePhantom,
		profileAirdrop
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth"
		}),
		isPublicPage(): boolean {
			return this.$route.name === "profile-id" || false
		}
	}
})
</script>

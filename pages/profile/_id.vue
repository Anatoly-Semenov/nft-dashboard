<template>
	<div class="profile">
		<ui-breadcrumb :crumbs="crumbs" />
		<p class="profile__title">Games</p>
		<profile-achievements-list type="public" :profileId="id" />
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Components
const profileAchievementsList = () =>
	import(
		/* webpackChunkName: "profile-achievements-list" */ "~/components/profile/profile-achievements-list.vue"
	)

// Types
import type { Crumb } from "~/types/ui-kit/ui-breadcrumb"

export default Vue.extend({
	name: "page-profile-detail",
	layout: "index",
	transition: "fade-in",
	components: {
		profileAchievementsList
	},
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			profile: "profile/getPublicProfile"
		}),
		id(): string {
			return this.$route.params.id
		},
		crumbs(): Crumb[] {
			return [
				{
					route: "Leaderboard",
					action: () => {
						this.$router.push("/leaderboard")
					}
				},
				{
					route: this.profile?.name || this.profile?.wallet || "Loading",
					action: () => {}
				}
			]
		}
	}
})
</script>

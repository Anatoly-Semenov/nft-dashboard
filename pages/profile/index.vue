<template>
	<client-only>
		<div class="profile">
			<div class="profile__content">
				<div class="profile__container">
					<profile-connect-list v-if="isDesktop" />
					<transition name="fade-in-reverse">
						<ui-alert
							:message="processMessage"
							type="warning"
							v-if="getIsAchievementsProcessing"
						>
							<ui-icon
								slot="icon"
								type="loading"
								color="var(--color-highlight)"
							/>
						</ui-alert>
					</transition>
					<profile-available />
					<p class="profile__title _tabs" v-if="!getIsEmptyAchievements">
						My games
					</p>
					<ui-tabs v-model="activeTab" @change="activeTab = $event">
						<a-tab-pane
							v-for="({ name, component }, index) in tabs"
							:key="`${index + 1}`"
							:tab="name"
						>
							<component :is="component" />
						</a-tab-pane>
					</ui-tabs>
					<template v-if="screenWidth > 1320">
						<profile-game-add />
						<ui-faq />
					</template>
				</div>
			</div>
			<!--			<network-modal />-->
		</div>
	</client-only>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Components
const profileAvailable = () =>
	import(
		/* webpackChunkName: "profile-available" */ "~/components/profile/profile-available.vue"
	)
const profileAchievementsList = () =>
	import(
		/* webpackChunkName: "profile-achievements-list" */ "~/components/profile/profile-achievements-list.vue"
	)
const profileStats = () =>
	import(
		/* webpackChunkName: "profile-stats" */ "~/components/profile/profile-stats.vue"
	)
const profileGameAdd = () =>
	import(
		/* webpackChunkName: "profile-games-add" */ "~/components/profile/profile-game-add.vue"
	)
// Todo: temporary hide network modal
// import networkModal from "~/components/network/network-modal.vue"

const profileConnectList = () =>
	import(
		/* webpackChunkName: "profile-connect-list" */ "~/components/profile/profile-connect-list.vue"
	)

export default mixins(widthMixin).extend({
	name: "page-profile",
	layout: "index",
	middleware: "auth",
	transition: "fade-in",
	components: {
		// networkModal,
		profileAvailable,
		profileGameAdd,
		profileConnectList
	},
	data() {
		return {
			activeTab: "1",
			processMessage:
				"Your achievements are being updated. This may take a couple of minutes. Please note that indexing events on the blockchain may take up to a day.",
			tabs: [
				{
					id: "1",
					name: "Achievements",
					component: profileAchievementsList
				},
				{
					id: "2",
					name: "Stats",
					component: profileStats
				}
			]
		}
	},
	mounted() {
		this.$scrollTo()

		this.$amplitude.pageView("profile")

		this.achievementProcessingCheck()
	},
	beforeDestroy() {
		this.setAchievements(null)
	},
	computed: {
		...mapGetters({
			getIsAchievementsProcessing: "profile/getIsAchievementsProcessing",
			getIsEmptyAchievements: "profile/getIsEmptyAchievements"
		}),
		isDesktop(): boolean {
			return this.screenWidth > 1320
		}
	},
	methods: {
		...mapMutations({
			setAchievements: "profile/setAchievements"
		}),
		...mapActions({
			fetchAchievementProcessing: "profile/fetchAchievementProcessing"
		}),
		async achievementProcessingCheck() {
			await this.fetchAchievementProcessing()

			if (this.getIsAchievementsProcessing) {
				const interval = window.setInterval(async () => {
					await this.fetchAchievementProcessing()

					if (!this.getIsAchievementsProcessing) {
						window.clearInterval(interval)
					}
				}, 10000)
			}
		}
	}
})
</script>

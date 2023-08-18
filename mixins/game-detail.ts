import Vue from "vue"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Components
import gameProfile from "~/components/game/game-profile.vue"

// Types
import type { GameService } from "@nft-types"
import type { Crumb } from "~/types/ui-kit/ui-breadcrumb"

export default Vue.extend({
	components: {
		gameProfile
	},
	data() {
		return {
			isLoading: true as boolean
		}
	},
	created() {
		this.setActiveGameId(this.id)
	},
	mounted() {
		this.$scrollTo()
	},
	beforeDestroy() {
		// reset game detail data
		this.setGame()
		this.setUpcomingGame()
		this.setArticles()

		this.resetCharts()
	},
	methods: {
		...mapMutations({
			setActiveGameId: "games-charts/setActiveGameId",
			setUpcomingGame: "games/setUpcomingGame",
			setGame: "games/setGame",
			setArticles: "games/setArticles",
			resetCharts: "games-charts/reset"
		}),
		...mapActions({
			fetchGame: "games/fetchGame"
		})
	},
	computed: {
		...mapGetters({
			getGame: "games/getGame",
			getUpcomingGame: "games/getUpcomingGame"
		}),
		id(): string {
			return this.$route.params.id
		},
		crumbs(): Crumb[] {
			let backUrl: string = "/dashboard"
			let backUrlName: string = "Dashboard"

			if (this.$route.name!.toLowerCase().includes("profile")) {
				backUrl = "/profile"
				backUrlName = "Profile"
			} else if (this.isUpcoming) {
				backUrl = "/calendar"
				backUrlName = "Calendar"
			}

			return [
				{
					route: backUrlName,
					action: () => {
						this.$router.push(backUrl)
					}
				},
				{
					route: this.isLoading ? "Loading..." : this.title,
					action: () => {}
				}
			]
		},
		title(): string {
			return this.game?.title || ""
		},
		isUpcoming(): boolean {
			const isUpcoming: boolean | undefined =
				this.getGame?.is_upcoming || this.getUpcomingGame?.is_upcoming

			if (typeof isUpcoming === "boolean") {
				return isUpcoming
			} else {
				return this.$route?.query?.type === "upcoming"
			}
		},
		game(): GameService.GameDetail | null {
			if (this.isLoading) {
				return null
			} else {
				return this.isUpcoming ? this.getUpcomingGame : this.getGame
			}
		},
		background(): string {
			// @ts-ignore
			return this.game?.background_image || ""
		}
	}
})

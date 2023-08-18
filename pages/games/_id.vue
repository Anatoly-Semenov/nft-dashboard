<template>
	<div class="game" :class="{ _loading: isLoading }">
		<div class="game__background" v-if="background">
			<div
				class="game__background-image"
				:style="`background-image: url(${background});`"
				v-if="screenWidth > 700"
			/>
			<div class="game__background-gradient" />
		</div>
		<div class="game__container">
			<ui-breadcrumb :crumbs="crumbs" :isLoading="isLoading" />
			<div class="game__info">
				<div class="game__main">
					<game-profile :isUpcoming="isUpcoming" :isLoading="isLoading" />
					<div class="game__about">
						<p class="game__about-title" v-if="false">About</p>
						<p class="game__about-description">{{ description }}</p>
					</div>
					<game-statistics :isUpcoming="isUpcoming" :isLoading="isLoading" />
					<game-pictures :isUpcoming="isUpcoming" :isLoading="isLoading" />
					<game-backers v-if="isUpcoming" />
				</div>
				<div class="game__intro">
					<game-social :isUpcoming="isUpcoming" :isLoading="isLoading" />
					<game-tokens v-if="!isUpcoming" :id="id" />
				</div>
			</div>
		</div>

		<game-charts :isUpcoming="isUpcoming" />

		<game-articles />
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"
import gameDetailMixin from "~/mixins/game-detail"

// Components
import gameStatistics from "~/components/game/game-statistics.vue"
import gameCharts from "~/components/game/game-charts.vue"
const gamePictures = () =>
	import(
		/* webpackChunkName: "game-pictures" */ "~/components/game/game-pictures.vue"
	)
const gameSocial = () =>
	import(
		/* webpackChunkName: "game-social" */ "~/components/game/game-social.vue"
	)
const gameBackers = () =>
	import(
		/* webpackChunkName: "game-backers */ "~/components/game/game-backers.vue"
	)
const gameTokens = () =>
	import(
		/* webpackChunkName: "game-tokens" */ "~/components/game/game-tokens.vue"
	)
const gameArticles = () =>
	import(
		/* webpackChunkName: "game-articles" */ "~/components/game/game-articles.vue"
	)

// Interfaces
import type { Crumb } from "~/types/ui-kit/ui-breadcrumb"
import type { GameService } from "@sk-types"

export default mixins(widthMixin, gameDetailMixin).extend({
	name: "page-games-detail",
	layout: "index",
	transition: "fade-in",
	head(): { title: string } {
		return {
			title: `| Game ${this.title}`
		}
	},
	components: {
		gameStatistics,
		gameSocial,
		gameCharts,
		gamePictures,
		gameArticles,
		gameBackers,
		gameTokens
	},
	async fetch(): Promise<void> {
		this.isLoading = true

		this.isUpcoming
			? await this.fetchUpcomingGame(this.id)
			: await this.fetchGame(this.id)

		this.isLoading = false

		await this.fetchGameArticles(this.id)
	},
	mounted() {
		this.$amplitude.pageView("game_details", {
			game_name: this.game?.title || ""
		})
	},
	computed: {
		...mapGetters({
			getGameDescription: "games/getGameDescription"
		}),
		description(): string {
			return this.getGameDescription(this.isUpcoming)
		},
		image(): string {
			return this.game?.image || ""
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
		imageStyle(): string {
			return `backgroundImage: ${
				// @ts-ignore
				this.isLoading ? "auto" : "url(" + this.image || "" + ")"
			}`
		}
	},
	methods: {
		...mapActions({
			fetchUpcomingGame: "games/fetchUpcomingGame",
			fetchGameArticles: "games/fetchGameArticles"
		})
	}
})
</script>

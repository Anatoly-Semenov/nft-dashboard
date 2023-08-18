<template>
	<div class="calendar__widgets">
		<h1 class="calendar__widgets-title">
			<ui-icon type="star" theme="filled" color="#FFE773" />
			Trending projects
		</h1>
		<div class="calendar__widgets-items">
			<div class="calendar__widgets-row _small">
				<calendar-trending
					v-for="(data, index) in isLoading
						? loadingTrendingGames
						: trendingGames"
					:key="data.id + index"
					:data="data"
					:isLoading="isLoading"
				/>
			</div>
			<div class="calendar__widgets-row">
				<calendar-upcoming
					v-for="(game, index) in upcomingGames"
					:key="game.title + index"
					v-bind="game"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Components
import calendarTrending from "~/components/calendar/calendar-trending.vue"
import calendarUpcoming from "~/components/calendar/calendar-upcoming.vue"

// Types
import type { GameService } from "@nft-types"

export default Vue.extend({
	name: "calendar-widgets",
	components: {
		calendarTrending,
		calendarUpcoming
	},
	data() {
		return {
			isLoading: true as boolean,
			trendingGames: null as null | GameService.UpcomingGame[],
			upcomingGamesIDO: null as null | GameService.UpcomingGame[],
			upcomingGamesINO: null as null | GameService.UpcomingGame[],
			upcomingGamesRelease: null as null | GameService.UpcomingGame[],
			upcomingGamesOngoing: null as null | GameService.UpcomingGame[],
			loadingTrendingGames: [
				{
					id: 1,
					title: "Loading",
					token: "Loading",
					logo: "Loading"
				},
				{
					id: 2,
					title: "Loading",
					token: "Loading",
					logo: "Loading"
				},
				{
					id: 3,
					title: "Loading",
					token: "Loading",
					logo: "Loading"
				},
				{
					id: 4,
					title: "Loading",
					token: "Loading",
					logo: "Loading"
				},
				{
					id: 5,
					title: "Loading",
					token: "Loading",
					logo: "Loading"
				}
			],
			loadingUpcomingList: [
				{
					id: 1,
					title: "Loading",
					token: "Loading",
					logo: "Loading",
					ido_date: "Loading",
					ino_date: "Loading",
					release_date: "Loading"
				},
				{
					id: 2,
					title: "Loading",
					token: "Loading",
					logo: "Loading",
					ido_date: "Loading",
					ino_date: "Loading",
					release_date: "Loading"
				},
				{
					id: 3,
					title: "Loading",
					token: "Loading",
					logo: "Loading",
					ido_date: "Loading",
					ino_date: "Loading",
					release_date: "Loading"
				},
				{
					id: 4,
					title: "Loading",
					token: "Loading",
					logo: "Loading",
					ido_date: "Loading",
					ino_date: "Loading",
					release_date: "Loading"
				}
			]
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true

		await this.fetchGames()

		this.isLoading = false
	},
	computed: {
		upcomingGames(): any {
			const games = [
				{
					isLoading: this.isLoading,
					title: "Upcoming IDO",
					games: this.isLoading
						? this.loadingUpcomingGames
						: this.upcomingGamesIDO,
					type: "ido"
				},
				{
					isLoading: this.isLoading,
					title: "Upcoming INO",
					games: this.isLoading
						? this.loadingUpcomingGames
						: this.upcomingGamesINO,
					type: "ino"
				},
				{
					isLoading: this.isLoading,
					title: "Upcoming game release",
					games: this.isLoading
						? this.loadingUpcomingGames
						: this.upcomingGamesRelease,
					type: "release"
				}
			]

			if (this.isLoading || this.upcomingGamesOngoing?.length) {
				games.unshift({
					isLoading: this.isLoading,
					title: "Ongoing events",
					games: this.isLoading
						? this.loadingUpcomingGames
						: this.upcomingGamesOngoing,
					type: "ongoing"
				})
			}

			return games
		},
		loadingUpcomingGames(): { title: string; games: any[] }[] {
			return [0, 1, 2, 3].map(() => {
				return {
					title: "Loading",
					games: this.loadingUpcomingList
				}
			})
		}
	},
	methods: {
		async fetchGames(): Promise<void> {
			await Promise.all([
				this.fetchTrendingGames(),
				this.fetchUpcomingIDO(),
				this.fetchUpcomingINO(),
				this.fetchUpcomingRelease(),
				this.fetchOngoingGames()
			]).catch(() => {})
		},
		async fetchTrendingGames(): Promise<void> {
			await this.$gameApi
				.getUpcomingGames({
					sort: "trend",
					limit: 5
				})
				.then((data) => {
					this.trendingGames = data.items
				})
		},
		async fetchUpcomingIDO(): Promise<void> {
			await this.$gameApi
				.getUpcomingGames({
					sort: "ido_date",
					limit: 4
				})
				.then((data) => {
					this.upcomingGamesIDO = data.items
				})
		},
		async fetchUpcomingINO(): Promise<void> {
			await this.$gameApi
				.getUpcomingGames({
					sort: "ino_date",
					limit: 4
				})
				.then((data) => {
					this.upcomingGamesINO = data.items
				})
		},
		async fetchUpcomingRelease(): Promise<void> {
			await this.$gameApi
				.getUpcomingGames({
					sort: "release_date",
					limit: 4
				})
				.then((data) => {
					this.upcomingGamesRelease = data.items
				})
		},
		async fetchOngoingGames(): Promise<void> {
			await this.$gameApi
				.getUpcomingGames({
					sort: "ongoing",
					limit: 5
				})
				.then((data) => {
					this.upcomingGamesOngoing = data.items
				})
		}
	}
})
</script>

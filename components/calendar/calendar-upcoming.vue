<template>
	<div class="calendar__upcoming" :class="{ _loading: isLoading }">
		<div class="calendar__upcoming-header">
			<p class="calendar__upcoming-title">{{ title }}</p>
		</div>
		<div class="calendar__upcoming-games">
			<div
				class="calendar__upcoming-game"
				v-for="(game, index) in games"
				:key="index"
			>
				<ui-game :game="game" upcoming :loading="isLoading" />
				<p class="calendar__upcoming-year" v-if="ongoingStatus(game)">
					{{ ongoingStatus(game) }}
				</p>
				<ui-statistic
					v-else-if="date(game) !== '-'"
					:data="date(game)"
					:deltaValue="year(game)"
					:isLoading="isLoading"
					deltaValueType="text"
					size="middle"
				/>
				<p class="calendar__upcoming-year" v-else-if="year(game)">
					{{ year(game) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"
import dayjs from "dayjs"

// Types
import type { GameService } from "@sk-types"
type DateType = "release" | "ino" | "ido"

export default Vue.extend({
	name: "calendar-upcoming",
	props: {
		title: String,
		games: Array as PropOptions<GameService.UpcomingGame[]>,
		isLoading: Boolean,
		type: String as PropOptions<DateType>
	},
	data() {
		return {}
	},
	methods: {
		date(game: GameService.UpcomingGame): string {
			return this.$formatDate({
				// @ts-ignore
				value: game?.[`${this.type}_date`],
				// @ts-ignore
				estimation: game?.[`${this.type}_date_estimation`],
				hasYear: false
			})
		},
		year(game: GameService.UpcomingGame): string {
			// @ts-ignore
			const date: string = game?.[`${this.type}_date`] || ""
			if (date) {
				return dayjs(date).format("YYYY")
			} else {
				return ""
			}
		},
		ongoingStatus(game: GameService.UpcomingGame): string | null {
			if (game.ino_status === "Ongoing") {
				return "INO"
			}

			if (game.ido_status === "Ongoing") {
				return "IDO"
			}

			return null
		}
	}
})
</script>

<template>
	<div class="leaderboard">
		<div class="leaderboard__intro">
			<div class="leaderboard__info">
				<p class="leaderboard__info-title">Leaderboard</p>
				<p class="leaderboard__info-description">
					Leaderboard is a new type of competition structure that rewards
					elevated performance on a consistent basis.
				</p>
			</div>

			<div class="leaderboard__filters">
				<ui-input
					class="leaderboard__search"
					placeholder="Find gamer"
					:value="search"
					@input="
						(value) => {
							search = value
							setSearch()
						}
					"
				>
					<ui-icon slot="prefix" type="search" />
				</ui-input>
				<ui-radio
					:activeValue="activeDay"
					:list="list"
					:isLoadingData="isLoadingFilters"
					@change="setDay"
				/>
			</div>
		</div>

		<leaderboard-rewards />

		<leaderboard-table />
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions } from "vuex"

// Components
import leaderboardRewards from "~/components/leaderboard/leaderboard-rewards.vue"
import leaderboardTable from "~/components/leaderboard/leaderboard-table.vue"

// Lodash
import _debounce from "lodash/debounce"

// Types
type DayItem = "24H" | "7D" | "30D" | "ALL"

export default Vue.extend({
	name: "page-leaderboard",
	layout: "index",
	transition: "fade-in",
	components: {
		leaderboardRewards,
		leaderboardTable
	},
	data() {
		return {
			search: "",
			activeDay: "ALL",
			list: ["24H", "7D", "30D", "ALL"] as DayItem[],
			isLoadingFilters: false
		}
	},
	computed: {
		setSearch(): () => void {
			return _debounce(this.setFilterToStore, 250, {
				maxWait: 1000
			})
		}
	},
	methods: {
		...mapActions({
			setFilter: "leaderboard/setFilter"
		}),
		async setDay(value: DayItem) {
			this.activeDay = value

			let filterValue: number

			switch (value as DayItem) {
				case "24H":
					filterValue = 1
					break
				case "7D":
					filterValue = 7
					break
				case "30D":
					filterValue = 30
					break
				case "ALL":
					filterValue = 360
					break
			}

			this.isLoadingFilters = true
			await this.setFilter({ param: "by_days", value: filterValue })
			this.isLoadingFilters = false
		},
		setFilterToStore(): void {
			const value = this.search

			this.setFilter({ param: "q", value })
		}
	}
})
</script>

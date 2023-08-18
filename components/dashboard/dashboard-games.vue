<template>
	<div class="dashboard__games">
		<p class="dashboard__title">All games</p>
		<div class="dashboard__games-filters">
			<ui-input placeholder="Search">
				<ui-icon slot="prefix" type="search" />
			</ui-input>
			<div class="dashboard__games-checkboxes">
				<ui-checkbox
					v-for="({ value, text, action }, index) in checkboxes"
					:key="index"
					:value="value"
					@change="action"
				>
					{{ text }}
				</ui-checkbox>
			</div>
		</div>
		<!-- Todo: temporary hide pagination		-->
		<client-only>
			<a-table
				:columns="columns"
				:dataSource="games"
				:pagination="false && pagination"
				:rowKey="({ id }) => id"
				class="ui-table _withoutHeaderBackground"
				:class="{ _loading: isLoading }"
				:scrollToFirstRowOnChange="screenWidth <= 700"
				key="table-games"
				@change="handleTableChange"
			>
				<!--	 title		-->
				<div class="dashboard__games-title" slot="game_title">
					<icon-table />
					Games
				</div>

				<div
					class="dashboard__games-column"
					v-for="({ slot, title, description }, index) in customHeadList"
					:key="index"
					:slot="slot"
				>
					<p class="dashboard__games-param">{{ title }}</p>
					<p class="dashboard__games-param-description">{{ description }}</p>
				</div>

				<!--	 Row		-->
				<div
					slot="game"
					slot-scope="text, { title, logo, id }"
					class="dashboard__games-item"
				>
					<ui-avatar :src="logo" v-if="!isLoading" />
					<div class="ui-avatar" v-else />
					<div class="dashboard__games-info">
						<p class="dashboard__games-name">{{ title }}</p>
						<nuxt-link class="dashboard__games-link" :to="`/games/${id}`">
							Learn more
							<ui-icon type="arrow-right" />
						</nuxt-link>
					</div>
				</div>

				<div slot="new_users" slot-scope="text, { stats }">
					<p>{{ stats.new_users || "n/a" }}</p>
				</div>

				<div slot="profit" slot-scope="text, { stats }">
					<p>{{ stats.profit ? `${stats.profit} %` : "n/a" }}</p>
				</div>

				<div slot="avg_roi" slot-scope="text, { stats }">
					<p>{{ stats.avg_roi ? `${stats.avg_roi} %` : "n/a" }}</p>
				</div>

				<div slot="risk_level" slot-scope="text, { stats }">
					<p>{{ stats.risk_level ? stats.risk_level : "n/a" }}</p>
				</div>

				<div slot="twitter" slot-scope="text, { stats }">
					<ui-statistic
						v-if="stats.twitter"
						:data="stats.twitter.members_count"
						:deltaValue="stats.twitter.members_growth_percentage"
						deltaValueType="percents"
						size="small"
					/>
				</div>
			</a-table>
		</client-only>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Icons
import iconTable from "~/assets/img/icons/icon-table.svg"

// Mocks
import { gamesList as loadingList } from "~/static/mocks"

// Interfaces
import type { UiTableColumn } from "~/types/ui-kit/ui-table"
import type { GameService } from "@sk-types"

interface Checkbox {
	value: boolean
	text: string
	action(value: boolean): void
}

interface GameTableRow {
	id: number
	image: string
	title: string
	min_investment_usd: number
	profit: number
	avg_roi: number
	risk_level: number
	twitter: number
	payback_usd: number
	apy_usd: number
}

export default mixins(widthMixin).extend({
	name: "dashboard-games",
	components: {
		iconTable
	},
	data() {
		return {
			isPlayedByUs: false as boolean,
			isFree: false as boolean,
			pagination: {
				total: 100,
				pageSize: 10,
				current: 1
			},
			isLoading: true as boolean,
			customHeadList: [
				{
					slot: "new_users_title",
					title: "New paying users",
					description: "last 30d"
				},
				{
					slot: "profit_title",
					title: "% in profit",
					description: "last 30d cohort"
				},
				{
					slot: "avg_roi_title",
					title: "Avg ROI",
					description: "last 30d cohort"
				},
				{
					slot: "risk_level_title",
					title: "Risk Level",
					description: "How hard it is to earn"
				},
				{
					slot: "twitter_title",
					title: "Twitter",
					description: "number of subscribers"
				}
			]
		}
	},
	async fetch(): Promise<void> {
		await this.fetchGames()

		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getGames: "games/getGames"
		}),
		columnWidth(): number | false {
			return this.screenWidth >= 1024 ? 160 : 100
		},
		columns(): UiTableColumn[] {
			return [
				{
					dataIndex: "game",
					key: "game",
					slots: { title: "game_title" },
					scopedSlots: { customRender: "game" },
					align: "left",
					width: this.screenWidth >= 700 ? 260 : 100,
					fixed: this.screenWidth >= 700 ? "left" : false
				},
				{
					dataIndex: "new_users",
					key: "new_users",
					slots: { title: "new_users_title" },
					scopedSlots: { customRender: "new_users" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					dataIndex: "profit",
					key: "profit",
					slots: { title: "profit_title" },
					scopedSlots: { customRender: "profit" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					dataIndex: "avg_roi",
					key: "avg_roi",
					slots: { title: "avg_roi_title" },
					scopedSlots: { customRender: "avg_roi" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					dataIndex: "risk_level",
					key: "risk_level",
					slots: { title: "risk_level_title" },
					scopedSlots: { customRender: "risk_level" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					dataIndex: "twitter",
					key: "twitter",
					slots: { title: "twitter_title" },
					scopedSlots: { customRender: "twitter" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				}
			]
		},
		checkboxes(): Checkbox[] {
			return [
				{
					value: this.isPlayedByUs,
					text: "Played by us",
					action: (value) => {
						this.isPlayedByUs = value
					}
				},
				{
					value: this.isFree,
					text: "Free to play",
					action: (value) => {
						this.isFree = value
					}
				}
			]
		},
		games(): GameTableRow[] | GameService.Game[] {
			return this.isLoading ? loadingList : this.getGames
		}
	},
	methods: {
		...mapMutations({
			setGamesSort: "games/setGamesSort"
		}),
		...mapActions({
			fetchGames: "games/fetchGames"
		}),
		handleTableChange(pagination: any, filters: any, sorter: any): void {
			if (Object.keys(pagination).length) {
				this.pagination = pagination
			}

			if (Object.keys(sorter).length) {
				this.setGamesSort({ type: "games", sorter: sorter })
			}
		}
	}
})
</script>

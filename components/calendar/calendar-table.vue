<template>
	<div class="calendar__table">
		<div class="calendar__intro">
			<div class="calendar__text">
				<p class="calendar__subtitle">All projects</p>
				<p class="calendar__description" v-text="description" />
			</div>

			<ui-input
				placeholder="Search"
				:value="search"
				@input="
					(value) => {
						searchUpcomingGames(value)
						search = value
					}
				"
				:disabled="isLoading"
			>
				<ui-icon slot="prefix" type="search" />
			</ui-input>
		</div>

		<client-only>
			<a-table
				:columns="columns"
				:dataSource="data"
				:pagination="!isLoading && pagination"
				:rowKey="() => Math.random()"
				class="ui-table"
				:class="{ _loading: isLoading }"
				:scrollToFirstRowOnChange="screenWidth <= 700"
				key="table-upcoming-games"
				@change="handleTableChange"
				:customRow="customRow"
			>
				<!--	 Row		-->
				<div
					slot="game"
					slot-scope="text, { title, logo, token }"
					class="calendar__item"
				>
					<ui-avatar :src="logo" :sizw="48" />
					<div class="calendar__info">
						<p class="calendar__name">{{ title }}</p>
						<p class="calendar__token">{{ token }}</p>
					</div>
				</div>

				<template slot="blockchain" slot-scope="text, { chains }">
					<ui-blockchains v-if="chains" :data="chains" :loading="isLoading" />
					<p v-else>TBA</p>
				</template>

				<div
					slot="ino_date"
					slot-scope="text, { marketplace, ino_date_format, ino_status }"
				>
					<button
						class="calendar__link"
						v-if="marketplace"
						@click="toLink(marketplace)"
					>
						<ui-tag
							class="calendar__tag-date"
							color="var(--color-highlight)"
							:loading="isLoading"
						>
							{{ ino_status === "Ongoing" ? "Ongoing" : "Marketplace" }}
							<ui-icon type="link" v-if="!isLoading" />
						</ui-tag>
					</button>
					<template v-else>
						<p class="calendar__date">
							{{ ino_date_format || "TBA" }}
						</p>
					</template>
				</div>

				<div
					slot="release_date"
					slot-scope="text, { release_date_format, release_status }"
				>
					<p
						class="calendar__date"
						:class="{
							_tba: !release_date_format || release_date_format === 'tba'
						}"
						v-if="release_status.toLowerCase() === 'not released'"
					>
						{{ release_date_format || "TBA" }}
					</p>
					<p class="calendar__date" v-else>
						{{ release_status }}
					</p>
				</div>

				<div slot="ido_date" slot-scope="text, { ido_date_format, ido_status }">
					<p
						class="calendar__date"
						:class="{
							_tba: !ido_date_format || ido_date_format === 'tba'
						}"
						v-if="ido_status.toLowerCase() === 'not over'"
					>
						{{ ido_date_format || "TBA" }}
					</p>
					<p class="calendar__date" v-else>
						{{ ido_status }}
					</p>
				</div>

				<template
					v-for="social in socials"
					:slot="social"
					slot-scope="text, { communities }"
				>
					<ui-statistic
						v-if="communities[social]"
						:data="communities[social].members_count"
						:deltaValue="communities[social].members_growth_percentage"
						deltaValueType="percents"
						:key="social"
					/>
					<p v-else :key="social">-</p>
				</template>
			</a-table>
		</client-only>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Mocks
import { upcomingGamesList as loadingList } from "~/static/mocks"

// Types
import type { UiTableColumn } from "~/types/ui-kit/ui-table"
import type { GameService } from "@nft-types"

export default mixins(widthMixin).extend({
	name: "calendar-table",
	data() {
		return {
			isLoading: false as boolean,
			socials: ["twitter", "discord", "telegram"] as string[],
			search: "" as string,
			page: 1 as number,
			blockchainsTemp: [
				require("~/assets/img/temp/chain-bsc.png"),
				require("~/assets/img/temp/chain-eth.png"),
				require("~/assets/img/temp/chain-solana.png")
			],
			blockchainsLoading: ["", "", ""],
			description: "Discover top and new projects to time the market"
		}
	},
	async fetch(): Promise<void> {
		if (this.isLoading) return

		this.isLoading = true

		if (!this.getUpcomingGames) {
			await this.fetchUpcomingGames()
		}

		this.isLoading = false
	},
	beforeDestroy() {
		this.searchUpcomingGames("")
	},
	computed: {
		...mapGetters({
			getGames: "games/getGames",
			getUpcomingGames: "games/getUpcomingGames"
		}),
		blockchains(): string[] {
			if (this.isLoading) {
				return this.blockchainsLoading
			} else {
				return this.blockchainsTemp
			}
		},
		columnWidth(): number | false {
			return this.screenWidth >= 1024 ? 160 : 200
		},
		data(): GameService.UpcomingGame[] {
			return this.isLoading ? loadingList : this.getUpcomingGames
		},
		columns(): UiTableColumn[] {
			return [
				{
					title: "Game",
					dataIndex: "game",
					key: "game",
					slots: { title: "game_title" },
					scopedSlots: { customRender: "game" },
					align: "left",
					width: 230,
					fixed: this.screenWidth >= 700 ? "left" : false,
					sorter: true
				},
				{
					title: "Blockchain",
					dataIndex: "blockchain",
					key: "blockchain",
					scopedSlots: { customRender: "blockchain" },
					width: this.columnWidth,
					align: "center",
					sorter: false
				},
				{
					title: "NFT status",
					dataIndex: "ino_date",
					key: "ino_date",
					scopedSlots: { customRender: "ino_date" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					title: "Game release",
					dataIndex: "release_date",
					key: "release_date",
					scopedSlots: { customRender: "release_date" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					title: "IDO",
					dataIndex: "ido_date",
					key: "ido_date",
					scopedSlots: { customRender: "ido_date" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					title: "Twitter",
					dataIndex: "twitter",
					key: "twitter",
					scopedSlots: { customRender: "twitter" },
					width: 100,
					align: "right",
					sorter: true
				}
				// Todo: Temporary hide columns
				/* ,
				{
					title: "Discord",
					dataIndex: "discord",
					key: "discord",
					scopedSlots: { customRender: "discord" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				},
				{
					title: "Telegram",
					dataIndex: "telegram",
					key: "telegram",
					scopedSlots: { customRender: "telegram" },
					width: this.columnWidth,
					align: "center",
					sorter: true
				}*/
			]
		},
		pagination(): any {
			if (!this.isLoading && !this.search) {
				return {
					total: 136,
					pageSize: 50,
					current: this.page
				}
			}

			return false
		}
	},
	methods: {
		...mapMutations({
			setGamesSort: "games/setGamesSort",
			setGamesSortName: "games/setGamesSortName",
			setGamesTwitterSort: "games/setGamesTwitterSort",
			searchUpcomingGames: "games/searchUpcomingGames",
			resetUpcomingGames: "games/resetUpcomingGames"
		}),
		...mapActions({
			fetchUpcomingGames: "games/fetchUpcomingGames"
		}),
		handleTableChange(pagination: any, filters: any, sorter: any): void {
			if (Object.keys(pagination).length) {
				this.page = pagination.current

				this.$scrollTo({
					top: this.screenWidth >= 700 ? 1130 : 2800,
					behavior: "smooth"
				})
			}

			if (Object.keys(sorter).length) {
				if (sorter.field === "game") {
					this.setGamesSortName(sorter.order)
				} else if (sorter.field === "twitter") {
					this.setGamesTwitterSort(sorter.order)
				} else {
					this.setGamesSort({ type: "upcoming", sorter: sorter })
				}
			}
		},
		customRow({ id }: { id: string }): object {
			return {
				on: {
					click: () => {
						if (!this.isLoading) this.$router.push(`/games/${id}?type=upcoming`)
					}
				}
			}
		},
		toLink(link: string): void {
			this.$stopEvents()
			this.$toLink(link)
		}
	}
})
</script>

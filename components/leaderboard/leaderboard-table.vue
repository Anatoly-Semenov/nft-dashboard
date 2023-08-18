<template>
	<client-only>
		<div class="leaderboard__table" :class="{ _loading: isLoading }">
			<a-table
				class="ui-table"
				:class="{ _loading: isLoading }"
				:columns="columns"
				:dataSource="data"
				:pagination="pagination"
				:rowKey="(row) => row.index"
				:customRow="customRow"
				key="table-scholars"
				@change="handleTableChange"
			>
				<div
					class="leaderboard__table-index"
					slot="index"
					slot-scope="item, { index }"
					:class="indexSelector(index)"
				>
					<icon-cup v-if="index < 3" />
					<p v-else>{{ index }}</p>
				</div>

				<div
					class="leaderboard__table-profile"
					slot="gamer"
					slot-scope="index, { avatar, name, wallet }"
				>
					<template v-if="!isLoading">
						<ui-avatar v-if="avatar" :src="avatar" :size="40" />
						<ui-jazzicon v-else-if="wallet" :address="wallet" :diameter="40" />
					</template>
					<div class="leaderboard__table-avatar" v-else />
					<div class="leaderboard__table-info">
						<template v-if="name">
							<p class="leaderboard__table-name">{{ name }}</p>
							<p class="leaderboard__table-wallet">
								{{ $shortWallet(wallet) }}
							</p>
						</template>
						<p class="leaderboard__table-name" v-else>
							{{ $shortWallet(wallet) }}
						</p>
					</div>
					<ui-tag color="var(--color-highlight)" v-if="isMe(name, wallet)">
						You
					</ui-tag>
				</div>

				<p
					class="leaderboard__table-text"
					slot="earned_achievements"
					slot-scope="index, { earned_achievements, total_achievements }"
				>
					{{ earned_achievements }} / {{ total_achievements }}
				</p>

				<p
					class="leaderboard__table-text"
					slot="games"
					slot-scope="index, { games }"
				>
					{{ games }}
				</p>

				<p
					class="leaderboard__table-text"
					slot="points"
					slot-scope="index, { points }"
				>
					{{ points }}
				</p>
			</a-table>
		</div>
	</client-only>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Icons
import iconCup from "~/assets/img/icons/icon-cup.svg"

// Mocks
import { leaderboardList as loadingLeaderboard } from "~/static/mocks"

// Types
import type { UiTableColumn } from "~/types/ui-kit/ui-table"
import type { ProfileService } from "@sk-types"
import type { SortOrder } from "~/types"

export default mixins(widthMixin).extend({
	name: "leaderboard-table",
	components: {
		iconCup
	},
	data() {
		return {
			page: 1 as number
		}
	},
	async created(): Promise<void> {
		await this.fetchLeaderboard()
	},
	computed: {
		...mapGetters({
			getUser: "auth/getUser",
			getLeaderboard: "leaderboard/getLeaderboard",
			meta: "leaderboard/getLeaderboardMata",
			isLoading: "leaderboard/getIsLoading"
		}),
		pagination(): any {
			if (!this.isLoading) {
				return {
					total: this.meta?.total_items || 0,
					pageSize: 25,
					current: this.meta?.current_page || 0
				}
			}

			return false
		},
		columns(): UiTableColumn[] {
			return [
				{
					title: "#",
					dataIndex: "index",
					key: "index",
					slots: { title: "index" },
					scopedSlots: { customRender: "index" },
					align: "center",
					width: 60,
					sorter: true
				},
				{
					title: "Gamer",
					dataIndex: "gamer",
					key: "gamer",
					scopedSlots: { customRender: "gamer" },
					align: "left"
				},
				{
					title: "Achievements",
					dataIndex: "earned_achievements",
					key: "earned_achievements",
					scopedSlots: { customRender: "earned_achievements" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: true
				},
				{
					title: "Games",
					dataIndex: "games",
					key: "games",
					scopedSlots: { customRender: "games" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: true
				},
				{
					title: "Points",
					dataIndex: "points",
					key: "points",
					scopedSlots: { customRender: "points" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: true
				}
			]
		},
		data(): ProfileService.LeaderboardData {
			if (this.isLoading) {
				return loadingLeaderboard.map(
					(item: ProfileService.LeaderboardItem, index: number) => {
						return {
							...item,
							index
						}
					}
				)
			}

			return this.getLeaderboard
		}
	},
	methods: {
		...mapActions({
			fetchLeaderboard: "leaderboard/fetchLeaderboard",
			setFilter: "leaderboard/setFilter",
			setSorter: "leaderboard/setSorter"
		}),
		isMe(name: string, wallet: string): boolean {
			if (this.getUser.displayedName) {
				return this.getUser.displayedName === name
			} else {
				return this.getUser.walletAddress === wallet
			}
		},
		indexSelector(index: number): string {
			switch (index) {
				case 0:
					return "_gold"
				case 1:
					return "_sliver"
				case 2:
					return "_bronze"
				default:
					return ""
			}
		},
		customRow({ user_id = "1" }: { user_id: string }): object {
			return {
				on: {
					click: () => {
						if (!this.isLoading) this.$router.push(`/profile/${user_id}`)
					}
				}
			}
		},
		handleTableChange(pagination: any, filters: any, sorter: any): void {
			const isChangePagination =
				Object.keys(pagination).length &&
				this.meta.current_page !== pagination.current

			if (isChangePagination) {
				this.setFilter({ param: "page", value: pagination.current })

				this.$scrollTo({
					top: 0,
					behavior: "smooth"
				})
			}

			if (Object.keys(sorter).length) {
				this.setSorter({ param: sorter.columnKey, value: sorter.order })
			}
		}
	}
})
</script>

<template>
	<div class="referral__table" :class="{ _loading: isLoading }">
		<p class="referral__table-title">Invitees</p>
		<a-table
			class="ui-table"
			:class="{ _loading: isLoading }"
			v-if="isTable"
			:columns="columns"
			:dataSource="users"
			:pagination="pagination"
			:rowKey="(row) => row.user.id"
			:customRow="customRow"
			@change="handleTableChange"
			key="table-scholars"
		>
			<div
				class="referral__table-profile"
				slot="user"
				slot-scope="index, { user }"
				v-if="user.walletAddress"
			>
				<template v-if="!isLoading">
					<ui-avatar v-if="user.avatar" :src="user.avatar" :size="40" />
					<ui-jazzicon
						v-else-if="user.walletAddress"
						:address="user.walletAddress"
						:diameter="40"
					/>
				</template>
				<div class="referral__table-avatar" v-else />
				<div class="referral__table-info">
					<template v-if="user.name">
						<p class="referral__table-name">{{ user.name }}</p>
						<p class="referral__table-wallet">
							{{ $shortWallet(user.walletAddress) }}
						</p>
					</template>
					<p class="referral__table-name" v-else>
						{{ $shortWallet(user.walletAddress) }}
					</p>
				</div>
			</div>

			<p
				class="referral__table-text"
				slot="achievements"
				slot-scope="index, { achievements }"
			>
				{{ achievements }}
			</p>

			<p
				class="referral__table-text"
				slot="games"
				slot-scope="index, { games }"
			>
				{{ games }}
			</p>

			<p
				class="referral__table-text"
				slot="balance"
				slot-scope="index, { balance }"
			>
				{{ balance }}
			</p>

			<p
				class="referral__table-text"
				slot="points"
				slot-scope="index, { points }"
			>
				{{ points }}
			</p>
		</a-table>
		<ui-result v-else :title="result.title" :description="result.description" />
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Mocks
import { referralUsersList as loadingUsers } from "~/static/mocks"

// Types
import type { ReferralService, UserService } from "@nft-types/"
import type { UiTableColumn } from "~/types/ui-kit/ui-table"

export default mixins(widthMixin).extend({
	name: "referral-table",
	data() {
		return {
			isLoading: false as boolean,
			result: {
				title: "You have no Invitees",
				description:
					"Share your personal link and get bonuses from .... If you think something went wrong and the invitee did not count, please email us at help@google.com"
			}
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchUsers({})
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getUsers: "referral/getUsers",
			meta: "referral/getUsersMeta"
		}),
		users(): ReferralService.Users {
			return this.isLoading ? loadingUsers : this.getUsers
		},
		isTable(): boolean {
			return this.isLoading || !!this.users?.length
		},
		pagination(): any {
			const { total_items = 0, current_page = 0 } = this.meta
			const pageSize = 25

			if (!this.isLoading && total_items > pageSize) {
				return {
					total: total_items || 0,
					pageSize,
					current: current_page || 0
				}
			}

			return false
		},
		columns(): UiTableColumn[] {
			return [
				{
					title: "Gamer",
					dataIndex: "user",
					key: "user",
					scopedSlots: { customRender: "user" },
					align: "left",
					sorter: false
				},
				{
					title: "Achievements",
					dataIndex: "achievements",
					key: "achievements",
					scopedSlots: { customRender: "achievements" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: false
				},
				{
					title: "Games",
					dataIndex: "games",
					key: "games",
					scopedSlots: { customRender: "games" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: false
				},
				{
					title: "SKG Balance",
					dataIndex: "balance",
					key: "balance",
					scopedSlots: { customRender: "balance" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: false
				},
				{
					title: "Points",
					dataIndex: "points",
					key: "points",
					scopedSlots: { customRender: "points" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "right",
					sorter: false
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchUsers: "referral/fetchUsers"
		}),
		customRow({ user }: { user: UserService.User }): object {
			return {
				on: {
					click: () => {
						if (!this.isLoading && user?.id)
							this.$router.push(`/profile/${user?.id}`)
					}
				}
			}
		},
		async handleTableChange(pagination: any): Promise<void> {
			const page: number = pagination.current

			const isChangePagination =
				Object.keys(pagination).length && this.meta.current_page !== page

			if (isChangePagination) {
				this.isLoading = true
				await this.fetchUsers({ page })
				this.isLoading = false

				this.$scrollTo({
					top: 0,
					behavior: "smooth"
				})
			}
		}
	}
})
</script>

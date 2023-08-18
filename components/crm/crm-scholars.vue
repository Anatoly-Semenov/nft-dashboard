<template>
	<client-only>
		<div class="crm__scholars" :class="{ _pagination: isPagination }">
			<a-table
				class="ui-table _withoutHeaderBackground"
				:columns="columns"
				:dataSource="scholars"
				:pagination="isPagination ? pagination : false"
				:rowKey="(row) => Math.random()"
				:class="{ _loading: isLoading }"
				key="table-scholars"
				@change="handleTableChange"
			>
				<template
					v-for="col in shortColumns"
					:slot="col"
					slot-scope="{ currentValue, deltaValue, type, units }"
				>
					<p :key="col" v-if="!currentValue">-</p>

					<button
						class="crm__scholars-address"
						:key="col"
						@click="$copy(currentValue)"
						v-else-if="type === 'address'"
					>
						<span>
							{{ currentValue }}
						</span>
						<ui-icon type="copy" />
					</button>

					<p class="crm__scholars-coin" v-else-if="type === 'coin'" :key="col">
						{{ currentValue }}
						<span class="crm__scholars-token" v-if="units">${{ units }}</span>
						<ui-delta :value="deltaValue" :type="type" :units="units" />
					</p>

					<p v-else-if="type === 'percents'" :key="col">
						{{ currentValue }}%
						<ui-delta :value="deltaValue" :type="type" />
					</p>

					<p v-else :key="col">
						{{ currentValue }}
						<ui-delta :value="deltaValue" :type="type" />
					</p>
				</template>
				<ui-button
					slot-scope="column"
					slot="notify"
					size="middle"
					isHighlight
					@click="setNotify(column)"
					:isUnauthorized="!getIsAuth"
				>
					Notify
				</ui-button>
				<ui-button
					slot-scope="column, data"
					slot="cancel"
					size="middle"
					@click="cancel(data)"
					:loading="isCancelLoading(data)"
					:isUnauthorized="!getIsAuth"
				>
					Cancel rent
				</ui-button>
			</a-table>
		</div>
	</client-only>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapGetters, mapActions, mapMutations } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Interfaces
import { UiTableColumn } from "~/types/ui-kit/ui-table"

export default mixins(widthMixin).extend({
	name: "crm-scholars",
	async created(): Promise<void> {
		await this.fetchData()
	},
	watch: {
		async getIsAuth(newValue, oldValue) {
			if (!oldValue && newValue) {
				await this.fetchData()
			}
		}
	},
	data() {
		return {
			activeWalletLoading: null as null | string,
			pagination: {},
			scholarsLoading: [
				{
					scholar: { currentValue: "loading 1" },
					discord: { currentValue: "loading 1" },
					earnied: { currentValue: "loading 1" },
					claimed: { currentValue: "loading 1" },
					winrate: { currentValue: "loading 1" },
					matches: { currentValue: "loading 1" }
				},
				{
					scholar: { currentValue: "loading 2" },
					discord: { currentValue: "loading 2" },
					earnied: { currentValue: "loading 2" },
					claimed: { currentValue: "loading 2" },
					winrate: { currentValue: "loading 2" },
					matches: { currentValue: "loading 2" }
				},
				{
					scholar: { currentValue: "loading 3" },
					discord: { currentValue: "loading 3" },
					earnied: { currentValue: "loading 3" },
					claimed: { currentValue: "loading 3" },
					winrate: { currentValue: "loading 3" },
					matches: { currentValue: "loading 3" }
				},
				{
					scholar: { currentValue: "loading 4" },
					discord: { currentValue: "loading 4" },
					earnied: { currentValue: "loading 4" },
					claimed: { currentValue: "loading 4" },
					winrate: { currentValue: "loading 4" },
					matches: { currentValue: "loading 4" }
				},
				{
					scholar: { currentValue: "loading 5" },
					discord: { currentValue: "loading 5" },
					earnied: { currentValue: "loading 5" },
					claimed: { currentValue: "loading 5" },
					winrate: { currentValue: "loading 5" },
					matches: { currentValue: "loading 5" }
				}
			],
			scholarsDefault: [
				{
					scholar: { currentValue: "-" },
					discord: { currentValue: "-" },
					earnied: { currentValue: "-" },
					claimed: { currentValue: "-" },
					winrate: { currentValue: "-" },
					matches: { currentValue: "-" }
				},
				{
					scholar: { currentValue: "-" },
					discord: { currentValue: "-" },
					earnied: { currentValue: "-" },
					claimed: { currentValue: "-" },
					winrate: { currentValue: "-" },
					matches: { currentValue: "-" }
				},
				{
					scholar: { currentValue: "-" },
					discord: { currentValue: "-" },
					earnied: { currentValue: "-" },
					claimed: { currentValue: "-" },
					winrate: { currentValue: "-" },
					matches: { currentValue: "-" }
				},
				{
					scholar: { currentValue: "-" },
					discord: { currentValue: "-" },
					earnied: { currentValue: "-" },
					claimed: { currentValue: "-" },
					winrate: { currentValue: "-" },
					matches: { currentValue: "-" }
				},
				{
					scholar: { currentValue: "-" },
					discord: { currentValue: "-" },
					earnied: { currentValue: "-" },
					claimed: { currentValue: "-" },
					winrate: { currentValue: "-" },
					matches: { currentValue: "-" }
				}
			]
		}
	},
	computed: {
		...mapGetters({
			getColumns: "crm/getColumns",
			getData: "crm/getData",
			getLoading: "crm/getLoading",
			getIsAuth: "auth/getIsAuth"
		}),
		isLoading(): boolean {
			return this.getLoading("scholars")
		},
		isPagination(): boolean {
			return this.scholars.length > 10
		},
		shortColumns(): string[] {
			if (this.isLoading || !this.getIsAuth) {
				return this.columns.map(({ key }: { key: string }) => key)
			} else {
				return this.getColumns?.map(({ key }: { key: string }) => key) || []
			}
		},
		columnWidth(): number | false {
			return this.screenWidth >= 700 ? false : 120
		},
		scholars(): any {
			if (!this.getIsAuth) {
				return this.scholarsDefault
			} else if (this.isLoading) {
				return this.scholarsLoading
			} else {
				return this.getData
			}
		},
		columns(): UiTableColumn[] {
			if (this.isLoading || !this.getIsAuth) {
				return this.defaultColumns
			} else if (this.getColumns) {
				return this.getColumns
			} else {
				return []
			}
		},
		defaultColumns(): UiTableColumn[] {
			return [
				{
					title: "Scholars",
					dataIndex: "scholar",
					key: "scholar",
					slots: { title: "scholar" },
					scopedSlots: { customRender: "scholar" },
					align: "left",
					width: this.screenWidth >= 700 ? 120 : 100,
					fixed: this.screenWidth >= 700 ? "left" : false
				},
				{
					title: "Discord",
					dataIndex: "discord",
					key: "discord",
					scopedSlots: { customRender: "discord" },
					width: this.screenWidth >= 700 ? false : 150,
					align: "center"
				},
				{
					title: "Earnied",
					dataIndex: "earnied",
					key: "earnied",
					scopedSlots: { customRender: "earnied" },
					width: this.columnWidth,
					align: "center"
				},
				{
					title: "Claimed",
					dataIndex: "claimed",
					key: "claimed",
					scopedSlots: { customRender: "claimed" },
					width: this.columnWidth,
					align: "center"
				},
				{
					title: "Winrate",
					dataIndex: "winrate",
					key: "winrate",
					scopedSlots: { customRender: "winrate" },
					width: this.columnWidth,
					align: "center"
				},
				{
					title: "Matches",
					dataIndex: "matches",
					key: "matches",
					scopedSlots: { customRender: "matches" },
					width: this.columnWidth,
					align: "center"
				},
				{
					title: " ",
					dataIndex: "notify",
					key: "notify",
					scopedSlots: { customRender: "notify" },
					width: 100,
					align: "center"
				},
				{
					title: " ",
					dataIndex: "cancel",
					key: "cancel",
					scopedSlots: { customRender: "cancel" },
					width: 100,
					align: "center"
				}
			]
		}
	},
	methods: {
		...mapMutations({
			setSort: "crm/setSort"
		}),
		...mapActions({
			fetchScholars: "crm/fetchScholars",
			deleteScholar: "crm/deleteScholar"
		}),
		async fetchData() {
			if (!this.getData?.length && this.getIsAuth) {
				await this.fetchScholars()
			}
		},
		setNotify(scholar: string): void {
			if (this.getIsAuth) {
				console.log(scholar)
			}
		},
		async cancel(scholar: any): Promise<void> {
			if (this.getIsAuth) {
				const wallet: string = scholar.wallet.currentValue

				this.activeWalletLoading = wallet
				await this.deleteScholar(wallet)
				this.activeWalletLoading = null
			}
		},
		isCancelLoading(data: any): boolean {
			const wallet: string | null = data?.wallet?.currentValue

			if (wallet) {
				return data?.wallet?.currentValue === this.activeWalletLoading
			}

			return false
		},
		handleTableChange(pagination: any, filters: any, sorter: any) {
			if (Object.keys(pagination).length) {
				this.pagination = pagination
			}

			if (Object.keys(sorter).length) {
				this.setSort(sorter)
			}
		}
	}
})
</script>

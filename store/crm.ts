// Types
import type { MutationTree, ActionTree, GetterTree } from "vuex"
import type { GameService, AnalyticsService } from "@sk-types"
import type { UiTableColumn, UiTableRow } from "~/types/ui-kit/ui-table"
import type { SortOrder } from "~/types"
type DayFilter = "1D" | "7D" | "30D"
type Loading = "scholars" | "total"

// Lodash
import _cloneDeep from "lodash/cloneDeep"

const getDays = (state: any) => {
	return Number(
		state.activeDayFilter.substring(0, state.activeDayFilter.length - 1)
	)
}

const stateObject = {
	games: null as null | GameService.Game[],
	total: null as null | AnalyticsService.ScholarColumn[],
	scholars: {
		columns: null as null | UiTableColumn[],
		data: null as null | UiTableRow[],
		notSortedData: null as null | UiTableRow[]
	},
	activeGameId: 2 as number,
	activeDayFilter: "7D" as DayFilter,
	loading: {
		total: false as boolean,
		scholars: false as boolean
	}
}

export const state = () => _cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setActiveGameId(state, id: number): void {
		state.activeGameId = id
	},
	setActiveDayFilter(state, id: DayFilter): void {
		state.activeDayFilter = id
	},
	setLoading(state, payload): void {
		interface Payload {
			type: Loading
			value: boolean
		}

		const { type, value }: Payload = payload

		state.loading[type] = value
	},
	setGames(state, games: GameService.Game[]): void {
		state.games = games
	},
	setTotal(state, scholars: AnalyticsService.ScholarColumn[]): void {
		state.total = scholars
	},
	setScholars(state, scholars: AnalyticsService.ScholarResponse): void {
		if (!state.scholars.data) {
			if (scholars?.length) {
				// Set columns
				scholars[0].columns.forEach(({ title, id }) => {
					const isArray: boolean = Array.isArray(state.scholars.columns)
					const isNotDuplicate: boolean =
						isArray &&
						state.scholars.columns!.findIndex(
							(column) => column.title === title
						) === -1

					const column: UiTableColumn = {
						title: title,
						key: id,
						dataIndex: id,
						scopedSlots: { customRender: id },
						width: 180
					}

					if (isNotDuplicate) {
						state.scholars.columns!.push({
							...column,
							align: "center",
							// @ts-ignore
							sorter: true
						})
					} else {
						state.scholars.columns = [
							{
								...column,
								align: "left",
								fixed: "left"
							}
						]
					}
				})

				state.scholars.columns!.push({
					title: " ",
					key: "notify",
					dataIndex: "notify",
					width: 100,
					align: "right",
					scopedSlots: { customRender: "notify" }
				})
				state.scholars.columns!.push({
					title: " ",
					key: "cancel",
					dataIndex: "cancel",
					width: 100,
					align: "right",
					scopedSlots: { customRender: "cancel" }
				})

				// Set rows
				scholars.forEach((scholar: AnalyticsService.Scholar) => {
					const newRow: UiTableRow = {}

					scholar.columns.forEach((column: AnalyticsService.ScholarColumn) => {
						newRow[column.id] = {
							currentValue: column.currentValue,
							deltaValue: column.deltaValue,
							type: column.type,
							units: column?.units || null
						}
					})

					if (Array.isArray(state.scholars.data)) {
						state.scholars.data.push(newRow)
					} else {
						state.scholars.data = [newRow]
					}
				})

				state.scholars.notSortedData = _cloneDeep(state.scholars.data)
			} else {
				state.scholars.notSortedData = []
				state.scholars.notSortedData = []
				state.scholars.columns = []
			}
		}
	},
	resetData(state): void {
		state.scholars.data = null
		state.scholars.notSortedData = null
		state.scholars.columns = null
		state.total = null
	},
	setSort(state, payload): void {
		if (Array.isArray(state.scholars.data)) {
			const columnKey: string = payload.columnKey
			const order: SortOrder = payload.order || "reset"

			switch (order) {
				case "ascend":
					state.scholars.data.sort((a, b) => {
						return b[columnKey].currentValue - a[columnKey].currentValue
					})
					break
				case "descend":
					state.scholars.data.sort((a, b) => {
						return a[columnKey].currentValue - b[columnKey].currentValue
					})
					break
				default:
					state.scholars.data = _cloneDeep(state.scholars.notSortedData)
					break
			}
		}
	},
	deleteScholar(state, wallet: string): void {
		const index: number = state.scholars.data!.findIndex(
			(scholar) => scholar.wallet.currentValue === wallet
		)

		state.scholars.data!.splice(index, 1)
	},
	reset(state) {
		const emptyState = _cloneDeep(stateObject)

		Object.keys(stateObject).forEach((name) => {
			// @ts-ignore
			state[name] = emptyState[name]
		})
	}
}

export const actions: ActionTree<RootState, RootState> = {
	async fetchGames({ commit }): Promise<void> {
		await this.$gameApi
			.getList()
			.then((data) => {
				commit("setGames", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchTotal({ state, commit }): Promise<void> {
		commit("setLoading", { type: "total", value: true })

		await this.$analyticsApi
			.getCommonInfo(state.activeGameId, getDays(state))
			.then((data) => {
				commit("setTotal", data)
			})
			.catch((error) => console.error(error.message, error))
			.finally(() => {
				commit("setLoading", { type: "total", value: false })
			})
	},
	async fetchScholars({ state, commit }): Promise<void> {
		commit("setLoading", { type: "scholars", value: true })

		await this.$analyticsApi
			.getScholarsInfo(state.activeGameId, getDays(state))
			.then((data) => {
				commit("setScholars", data)
			})
			.catch((error) => console.error(error.message, error))
			.finally(() => {
				commit("setLoading", { type: "scholars", value: false })
			})
	},
	async setFilter(
		{ commit, dispatch },
		{
			type,
			value
		}: { type: "activeGameId" | "activeDayFilter"; value: number | DayFilter }
	): Promise<void> {
		commit("resetData")

		if (type === "activeGameId") {
			commit("setActiveGameId", value)
		} else if (type === "activeDayFilter") {
			commit("setActiveDayFilter", value)
		}

		await Promise.all([dispatch("fetchTotal"), dispatch("fetchScholars")])
	},
	async addScholars({ state, commit, dispatch }, payload: string) {
		await this.$analyticsApi
			.addScholar(state.activeGameId, payload)
			.then(async () => {
				commit("resetData")

				await Promise.all([dispatch("fetchScholars"), dispatch("fetchTotal")])
			})
			.catch((error) => console.error(error.message, error))
	},
	async deleteScholar(
		{ state, commit, dispatch },
		wallet: string
	): Promise<void> {
		await this.$analyticsApi
			.deleteScholar(wallet, state.activeGameId)
			.then(async () => {
				commit("deleteScholar", wallet)
				await dispatch("fetchTotal")
			})
			.catch(() => {
				this.$message.error(`Failed delete ${wallet}`)
			})
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getActiveGameId: (state) => state.activeGameId,
	getActiveDayFilter: (state) => state.activeDayFilter,
	getTotal: (state) => state.total,
	getColumns: (state) => state.scholars.columns,
	getData: (state) => {
		if (state.scholars.data?.length) {
			return state.scholars.data
		} else {
			return []
		}
	},
	getLoading: (state) => (type: Loading) => state.loading[type]
}

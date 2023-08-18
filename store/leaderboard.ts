// Types
import type { ActionTree, GetterTree, MutationTree } from "vuex"
import type { ProfileService, RewardsService } from "@nft-types"

type Filters = "by_days" | "q" | "limit" | "page"
type Sorter = "index" | "total_achievements" | "games" | "points"
interface Params<T> {
	param: T
	value: any
}

// Lodash
import { cloneDeep } from "lodash"

const stateObject = {
	list: null as ProfileService.LeaderboardData | null,
	meta: null as ProfileService.LeaderboardResponse["meta"] | null,
	filters: {
		by_days: 360 as ProfileService.LeaderboardDays,
		q: "",
		limit: 25,
		page: 1
	},
	sorters: {
		index: null,
		total_achievements: null,
		games: null,
		points: null
	},
	isLoading: false as boolean,
	rewards: {
		date: "" as string,
		link: "" as string,
		list: null as RewardsService.Reward[] | null
	}
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setLeaderboard(
		state,
		payload: ProfileService.LeaderboardResponse | null
	): void {
		state.list = payload!.data

		state.meta = payload!.meta
	},
	resetSorters(state): void {
		// @ts-ignore
		Object.keys(state.sorters).forEach((item: Sorter) => {
			state.sorters[item] = null
		})
	},
	setSorter(state, { param, value }: Params<Sorter>): void {
		// @ts-ignore
		state.sorters[param] = value
	},
	setFilter(state, { param, value }: Params<Filters>): void {
		const isSetFilter: boolean =
			(typeof value === "string" && !/^\s*$/.test(value)) ||
			typeof value === "number"

		if (isSetFilter) {
			// @ts-ignore
			state.filters[param] = value
		} else {
			// @ts-ignore
			state.filters[param] = null
		}
	},
	setLoading(state, payload: boolean): void {
		state.isLoading = payload
	},
	setRewards(state, payload: RewardsService.Response): void {
		state.rewards = payload
	},
	reset(state): void {
		const emptyState = cloneDeep(stateObject)

		Object.keys(stateObject).forEach((name) => {
			// @ts-ignore
			state[name] = emptyState[name]
		})
	}
}

export const actions: ActionTree<RootState, RootState> = {
	async fetchLeaderboard({ commit, state }): Promise<void> {
		commit("setLoading", true)

		await this.$profileApi
			.getLeaderBoard({ ...state.filters, ...state.sorters })
			.then((data) => {
				commit("setLeaderboard", data)
			})
			.catch((error) => {
				console.error(error)
			})

		commit("setLoading", false)
	},
	async fetchRewards({ commit }) {
		await this.$rewardsApi
			.getList({ date: new Date().toISOString() })
			.then((data) => {
				commit("setRewards", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async setFilter(
		{ commit, dispatch },
		payload: Params<Filters>
	): Promise<void> {
		commit("setFilter", payload)

		await dispatch("fetchLeaderboard")
	},
	async setSorter(
		{ commit, dispatch },
		payload: Params<Sorter>
	): Promise<void> {
		commit("resetSorters")
		commit("setSorter", payload)
		commit("setFilter", { param: "page", value: 1 })

		await dispatch("fetchLeaderboard")
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getLeaderboard: (state) => state.list,
	getIsLoading: (state) => state.isLoading,
	getLeaderboardMata: (state) => state.meta,
	getRewards: (state) => state.rewards
}

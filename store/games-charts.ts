// Types
import type { MutationTree, ActionTree, GetterTree } from "vuex"
import type { SocialService } from "@sk-types"
import type {
	Series,
	SeriesName,
	ChartType,
	FetchParams,
	SeriesParams,
	StatisticParams,
	EconomicSeries
} from "~/types/game-charts"

// Lodash
import { cloneDeep } from "lodash"

// Methods
const isStatistic = (name: string): boolean => {
	return /* name === "earning" || name === "users" ||*/ name === "twitter"
}

const getSocialName = (name: SeriesName): SocialService.StatsServiceName => {
	let socialName: SocialService.StatsServiceName = "UNKNOWN"

	switch (name) {
		case "twitter":
			socialName = "TWITTER"
			break
		case "discord":
			socialName = "DISCORD"
			break
		case "telegram":
			socialName = "TELEGRAM"
			break
		default:
			break
	}

	return socialName
}

const stateObject = {
	fetchedData: {
		economic: false,
		social: false
	},

	activeGameId: 0 as number,

	twitterLink: "" as string,

	economic: {
		earning: {
			series: null as null | Series,
			statistic: {
				spent: 0,
				earn: 0,
				payback: 0,
				average: 0
			}
		},

		users: {
			series: null as null | EconomicSeries["users"],
			statistic: {
				active: 0,
				new: 0
			}
		},

		average: {
			series: null as null | EconomicSeries["average"]
		},

		nft: {
			series: null as null | EconomicSeries["nft"]
		},

		spendingEarning: {
			series: null as null | EconomicSeries["spendingEarning"]
		},

		spendersEarners: {
			series: null as null | EconomicSeries["spendersEarners"]
		},

		burnMint: {
			series: null as null | EconomicSeries["burnMint"]
		}
	},
	social: {
		twitter: {
			series: null as null | Series,
			statistic: {
				members_growth: 0,
				members_growth_percentage: 0,
				members_online_growth: 0,
				members_online_growth_percentage: 0,
				posts_growth: 0,
				posts_growth_percentage: 0,
				reposts_growth: 0,
				reposts_growth_percentage: 0,
				likes_growth: 0,
				likes_growth_percentage: 0,
				comments_growth: 0,
				comments_growth_percentage: 0
			}
		},

		discord: {
			series: null as null | Series[]
		},

		telegram: {
			series: null as null | Series
		}
	}
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setActiveGameId(state, payload: number) {
		state.activeGameId = payload
	},

	setSeries(state, { name, data, type }: SeriesParams): void {
		if (type === "social") {
			switch (name) {
				case "discord":
					// @ts-ignore
					state.social[name].series = [
						data.map(({ date, members_count }: any) => {
							return [date, members_count]
						}),
						data.map(({ date, members_online_count }: any) => {
							return [date, members_online_count]
						})
					]
					break
				default:
					// @ts-ignore
					state.social[name].series = data.map(
						({ date, members_count }: any) => {
							return [date, members_count]
						}
					)
			}
		} else if (type === "economic") {
			// @ts-ignore
			state.economic[name].series = data
		}
	},

	setStatistic(state, { name, data, type }: StatisticParams): void {
		if (isStatistic(name)) {
			// @ts-ignore
			state[type][name].statistic = data
		}
	},

	setTwitterLink(state, payload: string): void {
		state.twitterLink = payload
	},

	setIsFetchedFlag(
		state,
		{ type, value }: { type: ChartType; value: boolean }
	) {
		state.fetchedData[type] = value
	},

	reset(state) {
		const emptyState = cloneDeep(stateObject)

		Object.keys(stateObject).forEach((name) => {
			// @ts-ignore
			state[name] = emptyState[name]
		})
	}
}

export const actions: ActionTree<RootState, RootState> = {
	async fetchSeries({ commit, state }, { name, type }: FetchParams) {
		const promises = []

		if (type === "social") {
			await this.$socialApi
				.getSocialStatsInfo({
					gameId: state.activeGameId,
					serviceName: getSocialName(name),
					take: 100
				})
				.then((data) => {
					commit("setSeries", { name, data, type })
				})
		} else if (type === "economic") {
			if (name !== "earning") {
				switch (name) {
					case "users":
						promises.push(this.$gameApi.getUsersByDate(state.activeGameId))
						break
					case "average":
						promises.push(this.$gameApi.getAverageEarnings(state.activeGameId))
						break
					case "spendingEarning":
						promises.push(
							this.$gameApi.getSpendingAndEarnings(state.activeGameId)
						)
						break
					case "spendersEarners":
						promises.push(
							this.$gameApi.getSpendersAndEarners(state.activeGameId)
						)
						break
					case "nft":
						promises.push(this.$gameApi.getNftTrades(state.activeGameId))
						break
					case "burnMint":
						promises.push(this.$gameApi.getNftBurnAndMint(state.activeGameId))
						break
				}

				// @ts-ignore
				await Promise.all(promises)
					.then((data) => {
						commit("setSeries", { name, data, type })
					})
					.catch((error) => {
						console.log(error)
					})
			}
		}
	},

	async fetchStatistic({ state, commit }, { name, type }: FetchParams) {
		if (type === "social") {
			await this.$socialApi
				.getSocialStats({
					gameId: state.activeGameId,
					serviceName: getSocialName(name)
				})
				.then((data) => {
					commit("setStatistic", { name, data, type })
				})
		} else if (type === "economic") {
			await this.$gameApi.getFullList().then((data) => {
				commit("setStatistic", { name, data, type })
			})
		}
	},

	async fetchChart({ dispatch }, { name, type }: FetchParams) {
		const requests = [dispatch("fetchSeries", { name, type })]

		if (isStatistic(name)) {
			requests.push(dispatch("fetchStatistic", { name, type }))
		}

		await Promise.all(requests).catch((error) => console.error(error))
	},

	async fetchAllCharts(
		{ state, dispatch, commit },
		type: ChartType = "economic"
	) {
		if (state.activeGameId) {
			const economicNames = Object.keys(state.economic)
			const socialNames = Object.keys(state.social)

			const names = type === "economic" ? economicNames : socialNames
			const requests: Promise<void>[] = []

			names.forEach((name) => {
				requests.push(dispatch("fetchChart", { type: type, name }))
			})

			await Promise.all(requests).catch((error) => console.error(error))
		}

		commit("setIsFetchedFlag", { type, value: true })
	},

	async fetchTwitterLink({ state, commit }) {
		await this.$socialApi
			.getSocialLink({
				gameId: state.activeGameId,
				serviceName: "TWITTER"
			})
			.then((data) => {
				commit("setTwitterLink", data)
			})
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getIsFetchedData: (state) => {
		return (type: ChartType = "economic") => {
			return state.fetchedData[type]
		}
	},

	getSeries: (state) => {
		return (name: SeriesName, type: ChartType = "economic") => {
			// @ts-ignore
			return state[type][name]?.series || []
		}
	},

	getStatistic: (state) => {
		return (name: SeriesName, type: ChartType = "economic") => {
			// @ts-ignore
			return state[type][name]?.statistic || null
		}
	},

	getTwitterLink: (state) => state.twitterLink,

	getLoadingCharts: (state) => {
		return (type: ChartType = "economic") => {
			const data = {}

			// @ts-ignore
			Object.keys(state[type]).forEach((key: SeriesName) => {
				// @ts-ignore
				data[key] = !Array.isArray(state[type][key].series)
			})

			return data
		}
	}
}

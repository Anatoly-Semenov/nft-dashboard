import { MutationTree, ActionTree, GetterTree } from "vuex"
import dayjs from "dayjs"

const quarterOfYear = require("dayjs/plugin/quarterOfYear")
dayjs.extend(quarterOfYear)

import _cloneDeep from "lodash/cloneDeep"
import _isString from "lodash/isString"
import _isNumber from "lodash/isNumber"

const isDate = (value: string): boolean => {
	return dayjs(value).isValid()
}

// Types
import type { GameService, ArticleService, ResponseList } from "@nft-types"
import type { GameProfile, SortOrder } from "~/types"
type Game = GameService.Game
type GameDetail = GameService.GameDetail
type Tokens = GameService.TokenContract[]

export const state = () => ({
	games: {
		list: null as null | Game[],
		notSortedList: null as null | Game[],
		topList: null as null | Game[],
		detail: null as null | GameService.GameDetail,
		tokens: null as null | Tokens
	},
	upcoming: {
		list: null as null | GameService.UpcomingGame[],
		notSortedList: null as null | GameService.UpcomingGame[],
		detail: null as null | GameService.UpcomingGameDetail
	},
	articles: [] as ArticleService.Item[]
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setTopGames(state, games: Game[]): void {
		state.games.topList = games
	},
	setGames(state, games: Game[]): void {
		const formatGames = games.map((game: Game) => {
			// @ts-ignore
			game.stats.profit = Number(this.$formatNumber(game.stats.profit))
			game.stats.avg_roi = Number(
				// @ts-ignore
				this.$formatNumber(game.stats.avg_roi, "percent")
			)

			return game
		})

		state.games.list = state.games.notSortedList = formatGames
	},
	setUpcomingGames(state, games: ResponseList<GameService.UpcomingGame>): void {
		const formatDates = (
			key: "release_date" | "ino_date" | "ido_date",
			value: string | null,
			index: number
		): void => {
			// @ts-ignore
			games.items[index][`${key}_format`] = this.$formatDate({
				// @ts-ignore
				value: value,
				// @ts-ignore
				estimation: games.items[index][`${key}_estimation`],
				hasYear: true
			})
		}

		games.items.forEach(({ release_date, ido_date, ino_date }, index) => {
			formatDates("release_date", release_date, index)
			formatDates("ido_date", ido_date, index)
			formatDates("ino_date", ino_date, index)
		})

		if (state.upcoming.notSortedList === null) {
			state.upcoming.list = state.upcoming.notSortedList = games.items
		} else {
			state.upcoming.list = state.upcoming.notSortedList = [
				...state.upcoming.notSortedList,
				...games.items
			]
		}
	},
	searchUpcomingGames(state, payload: string): void {
		if (payload) {
			state.upcoming.list = _cloneDeep(state.upcoming.notSortedList!).filter(
				({ title }) => {
					return title.toLowerCase().includes(payload.toLowerCase())
				}
			)
		} else {
			state.upcoming.list = _cloneDeep(state.upcoming.notSortedList)
		}
	},
	resetUpcomingGames(state): void {
		state.upcoming.list = state.upcoming.notSortedList = null
	},
	setGame(state, game: GameDetail | null = null): void {
		state.games.detail = game
	},
	setUpcomingGame(
		state,
		game: GameService.UpcomingGameDetail | null = null
	): void {
		state.upcoming.detail = game
	},
	setArticles(state, article: ArticleService.Item | null = null): void {
		if (
			typeof article === "object" &&
			article !== null &&
			Object.keys(article!).length
		) {
			state.articles = [article!]
		} else {
			state.articles = []
		}
	},
	setGamesSort(
		state,
		{
			type,
			sorter
		}: {
			type: "games" | "upcoming"
			sorter: {
				columnKey: string
				order: SortOrder
			}
		}
	): void {
		const isUpcoming: boolean = type === "upcoming"

		if (Array.isArray(state[type].list)) {
			const columnKey: string = sorter.columnKey
			const order: SortOrder = sorter.order || "reset"

			switch (order) {
				case "ascend":
					state[type].list!.sort((a: any, b: any) => {
						let _a: string | number
						let _b: string | number

						// @ts-ignore
						if (sorter.field === "twitter") {
							_a = isUpcoming
								? a.twitter.members_count
								: a.stats.twitter.members_count
							_b = isUpcoming
								? b.twitter.members_count
								: b.stats.twitter.members_count
						} else {
							_a =
								(isUpcoming ? a[columnKey] : a.stats[columnKey]) ||
								"20025-01-01T00:00:00.000Z"
							_b =
								(isUpcoming ? b[columnKey] : b.stats[columnKey]) ||
								"20025-01-01T00:00:00.000Z"
						}

						if (_isString(_a) && _isString(_b)) {
							if (isDate(_a) && isDate(_b)) {
								return dayjs(_a).valueOf() - dayjs(_b).valueOf()
							}

							return _a.length - _b.length
						} else if (_isNumber(_a) && _isNumber(_b)) {
							return _a - _b
						}
						return 0
					})
					break
				case "descend":
					state[type].list!.sort((a: any, b: any) => {
						let _a: string | number
						let _b: string | number

						// @ts-ignore
						if (sorter.field === "twitter") {
							_a = isUpcoming
								? a.twitter.members_count
								: a.stats.twitter.members_count
							_b = isUpcoming
								? b.twitter.members_count
								: b.stats.twitter.members_count
						} else {
							_a =
								(isUpcoming ? a[columnKey] : a.stats[columnKey]) ||
								"20025-01-01T00:00:00.000Z"
							_b =
								(isUpcoming ? b[columnKey] : b.stats[columnKey]) ||
								"20025-01-01T00:00:00.000Z"
						}

						if (_isString(_b)) {
							// @ts-ignore
							if (isDate(_a) && isDate(_b)) {
								return dayjs(_b).valueOf() - dayjs(_a).valueOf()
							}

							// @ts-ignore
							return _b.length - _a.length
						} else if (_isNumber(_a) && _isNumber(_b)) {
							return _b - _a
						}
						return 0
					})
					break
				default:
					// @ts-ignore
					state[type].list! = _cloneDeep(state[type].notSortedList)
					break
			}
		}
	},
	setGamesSortName(state, order: SortOrder): void {
		switch (order) {
			case "ascend":
				state.upcoming.list = state.upcoming.list!.sort((a, b) => {
					return a.title.localeCompare(b.title)
				})
				break
			case "descend":
				state.upcoming.list = state.upcoming.list!.sort((a, b) => {
					return b.title.localeCompare(a.title)
				})
				break
			default:
				// @ts-ignore
				state.upcoming.list! = _cloneDeep(state.upcoming.notSortedList)
				break
		}
	},
	setGamesTwitterSort(state, order: SortOrder): void {
		switch (order) {
			case "ascend":
				state.upcoming.list = state.upcoming.list!.sort((a, b) => {
					const _a = a.communities?.twitter?.members_count || null
					const _b = b.communities?.twitter?.members_count || null

					// @ts-ignore
					return (_a === null) - (_b === null) || +(_a > _b) || -(_a < _b)
				})
				break
			case "descend":
				state.upcoming.list = state.upcoming.list!.sort((a, b) => {
					const _a = a.communities?.twitter?.members_count || null
					const _b = b.communities?.twitter?.members_count || null

					// @ts-ignore
					return (_a === null) - (_b === null) || -(_a > _b) || +(_a < _b)
				})
				break
			default:
				// @ts-ignore
				state.upcoming.list! = _cloneDeep(state.upcoming.notSortedList)
				break
		}
	},
	setTokens(state, payload: Tokens): void {
		if (payload) {
			payload.forEach(({ market_cap_delta }, index) => {
				payload[index].market_cap_delta = this.$formatNumber(
					// @ts-ignore
					market_cap_delta,
					"percent"
				)
			})

			state.games.tokens = payload
		} else {
			state.games.tokens = null
		}
	}
}

export const actions: ActionTree<RootState, RootState> = {
	async fetchTopGames({ commit }): Promise<void> {
		// todo: Добавить боевой запрос топовых игр
		// await this.$axios("/games/info")
		// 	.then(({ data }: { data: Game[] }) => {
		// 		commit("setTopGames", data)
		// 	})
		// 	.catch((error) => console.error(error.message, error))
	},
	async fetchGames({ commit }): Promise<void> {
		await this.$gameApi
			.getFullList()
			.then((data) => {
				commit("setGames", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchUpcomingGames({ commit }, page: number = 0): Promise<void> {
		await this.$gameApi
			.getUpcomingGames({
				limit: 200
			})
			.then((data) => {
				commit("setUpcomingGames", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchGame({ commit }, id: number): Promise<void> {
		await this.$gameApi
			.getFullGame(id)
			.then((data) => {
				commit("setGame", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchUpcomingGame({ commit }, id: string): Promise<void> {
		await this.$gameApi
			.getUpcomingGame(id)
			.then((data) => {
				commit("setUpcomingGame", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchGameArticles({ commit }, gameId: number): Promise<void> {
		await this.$articlesApi
			.getArticlesByGame(gameId)
			.then((data) => {
				commit("setArticles", data)
			})
			.catch((error) => console.error(error.message, error))
	},
	async fetchTokens({ commit }, gameId: number): Promise<void> {
		await this.$gameApi
			.getTokens(gameId)
			.then((data) => {
				commit("setTokens", data)
			})
			.catch((error) => console.error(error.message, error))
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getTopGames: (state) => state.games.topList,
	getGames: (state) => state.games.list,
	getUpcomingGames: (state) => state.upcoming.list,
	getGame: (state) => state.games.detail,
	getGameId: (state) => state.games.detail?.id || null,
	getGameLinks: (state, getters) => {
		return (isUpcoming = false): GameService.Link[] => {
			if (isUpcoming) {
				return getters.getUpcomingGame?.links || []
			}
			return getters.getGame?.links || []
		}
	},
	getGameProfile: (state) => {
		return (isUpcoming = false): GameProfile => {
			if (isUpcoming) {
				return {
					logo: state.upcoming.detail?.logo || "",
					title: state.upcoming.detail?.title || "",
					chains: state.upcoming.detail?.chains || "",
					genre: state.upcoming.detail?.genre || ""
				}
			}

			return {
				logo: state.games.detail?.logo || "",
				title: state.games.detail?.title || "",
				chains:
					// @ts-ignore
					state.games.detail?.chains ||
					state.games.detail?.chain_title?.toUpperCase() ||
					"",
				genre: state.games.detail?.genre || "",
				playersCount: state.games.detail?.stats?.players_count || ""
			}
		}
	},
	getGameDescription: (state, getters) => {
		return (isUpcoming = false): string => {
			if (isUpcoming) {
				return getters.getUpcomingGame?.description || ""
			}
			return getters.getGame?.description || ""
		}
	},
	getGameWebsite: (state, getters) => {
		return (isUpcoming = false): GameService.Link[] => {
			if (isUpcoming) {
				return getters.getUpcomingGame?.site || ""
			}
			return getters.getGame?.site || ""
		}
	},
	getGameStatistic: (state) => {
		const game = state.games.detail

		return {
			newUsers: game?.stats?.new_users || "n/a",
			percentInProfit: game?.stats?.profit
				? `${game?.stats?.profit.toFixed(2) || 0}%`
				: "n/a",
			avgRoi: game?.stats?.avg_roi || "n/a",
			riskLevel: game?.stats?.risk_level || "n/a"
		}
	},
	getUpcomingGameStatistic: (state) => {
		const game = state.upcoming.detail

		return {
			release: {
				value: game?.release_date || "",
				estimation: game?.release_date_estimation || "DAY"
			},
			ido: {
				value: game?.ido_date || "",
				estimation: game?.ido_date_estimation || "DAY",
				status: game?.ido_status
			},
			nft: {
				marketplace: game?.marketplace || "",
				// @ts-ignore
				inoDate: game?.ino_date_format || "",
				status: game?.ino_status
			}
		}
	},
	getPictures: (state, getters) => {
		return (isUpcoming = false): string[] => {
			if (isUpcoming) {
				return getters.getUpcomingGame?.pictures || []
			}
			return getters.getGame?.pictures || []
		}
	},
	getBackers: (state) => state.upcoming.detail?.backers.split("\n") || [],
	getUpcomingGame: (state) => state.upcoming.detail,
	getGameArticles: (state) => state.articles,
	getTokens: (state) => state.games.tokens
}

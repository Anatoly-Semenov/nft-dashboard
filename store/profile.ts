// Types
import type { ActionTree, GetterTree, MutationTree } from "vuex"
import { ProfileService, AchievementService } from "@nft-types"

type MeResponse = null | ProfileService.Me

// Lodash
import { cloneDeep } from "lodash"

const stateObject = {
	me: null as MeResponse,
	game: {
		data: {
			name: "",
			spend: 0,
			earn: 0,
			points: 0,
			roi: 0
		} as ProfileService.GameDetails,
		achievements: null as null | ProfileService.ProfileAchievement[]
	},
	achievements: null as null | ProfileService.ResponseAchievements,
	availableAchievements:
		null as null | ProfileService.ResponseAvailableAchievements,
	isAchievementsProcessing: false as boolean,
	games: {
		count: 0,
		items: null as null | ProfileService.Game[],
		total: {
			earning: 0,
			spending: 0
		}
	} as ProfileService.ResponseGames,
	publicProfile: {
		data: null as null | ProfileService.PublicProfile,
		achievements: null as null | ProfileService.PublicAchievements
	}
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setMe(state, payload: MeResponse | null) {
		state.me = payload
	},
	setGamesList(state, payload: ProfileService.ResponseGames) {
		state.games.count = payload?.count
		state.games.items = payload?.items
		state.games.total = payload?.total
	},
	setGame(state, payload: ProfileService.GameDetails | null) {
		if (typeof payload === "object" && Object.keys(payload!).length) {
			state.game.data.name = payload!.name
			state.game.data.spend = payload!.spend
			state.game.data.earn = payload!.earn
			state.game.data.points = payload!.points
			state.game.data.roi = payload!.roi
		} else {
			state.game = cloneDeep(stateObject.game)
		}
	},
	setGameAchievements(
		state,
		payload: ProfileService.ProfileAchievement[] | null
	) {
		state.game.achievements = payload
	},
	setAchievements(state, payload: ProfileService.ResponseAchievements | null) {
		state.achievements = payload
	},
	setAvailableAchievements(
		state,
		payload: ProfileService.ResponseAvailableAchievements | null
	) {
		if (payload) {
			state.availableAchievements = payload.map(
				(item: ProfileService.AvailableAchievement) => {
					item.status = "NOT_CLAIMED"

					return item
				}
			)
		} else {
			payload = null
		}
	},
	setAchievementStatus(state, nftId: number | number[]): void {
		if (state.achievements) {
			state.achievements.forEach(({ achievements }, achievementIndex) => {
				achievements.forEach(({ nfts }, achievementItemIndex) => {
					nfts!.forEach(({ id }) => {
						nftId = Number(nftId)

						if ((Array.isArray(nftId) && nftId.includes(id)) || id === nftId) {
							state.achievements![achievementIndex].achievements[
								achievementItemIndex
							].status = "CLAIMED"
						}
					})
				})
			})
		}

		if (state.availableAchievements) {
			state.availableAchievements.forEach(({ nfts }, achievementIndex) => {
				nfts!.forEach(({ id }) => {
					nftId = Number(nftId)
					if ((Array.isArray(nftId) && nftId.includes(id)) || id === nftId) {
						state.availableAchievements![achievementIndex].status = "CLAIMED"
					}
				})
			})

			// Force re-render
			const copy = cloneDeep(state.availableAchievements)

			state.availableAchievements = []
			state.availableAchievements = copy
		}

		if (state.game.achievements) {
			state.game.achievements.forEach(({ nfts }, achievementIndex) => {
				nfts!.forEach(({ id }) => {
					nftId = Number(nftId)
					if ((Array.isArray(nftId) && nftId.includes(id)) || id === nftId) {
						state.game.achievements![achievementIndex].status = "CLAIMED"
					}
				})
			})

			// Force re-render
			const copy = cloneDeep(state.game.achievements)

			state.game.achievements = []
			state.game.achievements = copy
		}
	},
	setClaimedAchievements(
		state,
		{ data, type }: { data: any[]; type: "list" | "detail" | "available" }
	) {
		const claimedNftIds: number[] = []

		data.forEach(({ returnValues }) => {
			claimedNftIds.push(Number(returnValues._achievementTypeId))
		})

		if (type === "list" && state.achievements) {
			state.achievements.forEach(({ achievements }, achievementsIndex) => {
				achievements.forEach(({ nfts }, achievementsItemIndex) => {
					nfts!.forEach(({ id }) => {
						if (claimedNftIds.includes(id)) {
							state.achievements![achievementsIndex].achievements[
								achievementsItemIndex
							].status = "CLAIMED"
						}
					})
				})
			})
		} else if (type === "detail" && state.game.achievements) {
			state.game.achievements.forEach(({ nfts }, achievementsItemIndex) => {
				nfts!.forEach(({ id }) => {
					if (claimedNftIds.includes(id)) {
						state.game.achievements![achievementsItemIndex].status = "CLAIMED"
					}
				})
			})
		} else if (type === "available" && state.availableAchievements) {
			state.availableAchievements.forEach(({ nfts }, achievementsItemIndex) => {
				nfts!.forEach(({ id }) => {
					if (!claimedNftIds.includes(id)) {
						state.availableAchievements![achievementsItemIndex].status =
							"NOT_CLAIMED"
					}
				})
			})

			state.availableAchievements = state.availableAchievements.filter(
				(item) => item?.status
			)
		}
	},
	setAchievementProcessing(state, payload: AchievementService.Status): void {
		state.isAchievementsProcessing = payload.status !== "completed"
	},
	setPublicProfile(state, payload: any): void {
		state.publicProfile.data = payload
	},
	setPublicAchievements(
		state,
		payload: ProfileService.ResponseAchievements
	): void {
		state.publicProfile.achievements = payload
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
	async fetchMe({ commit }): Promise<void> {
		await this.$profileApi
			.getMe()
			.then((data: MeResponse) => {
				commit("setMe", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchGamesList({ commit }): Promise<void> {
		await this.$profileApi
			.getGames()
			.then((data) => {
				commit("setGamesList", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchGame({ commit }, gameId: string): Promise<void> {
		await this.$profileApi
			.getGame(gameId)
			.then((data) => {
				commit("setGame", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchGameAchievements({ commit }, gameId: string): Promise<void> {
		await this.$profileApi
			.getGameAchievements(gameId)
			.then((data) => {
				commit("setGameAchievements", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchAchievements({ commit }): Promise<void> {
		await this.$profileApi
			.getAchievements()
			.then((data) => {
				commit("setAchievements", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchAvailableAchievements({ commit }): Promise<void> {
		await this.$profileApi
			.getEarnedAchievements()
			.then((data) => {
				commit("setAvailableAchievements", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async checkClaimedAchievements(
		{ rootGetters, commit },
		type = "list" as "list" | "detail" | "available"
	) {
		// Todo: temporary hide checkClaimedAchievements
		// await this.$nftContract
		// 	.getPastEvents("AchievementsMinted", {
		// 		filter: { _holder: rootGetters["auth/getWalletAddress"] },
		// 		fromBlock: 28000000,
		// 		toBlock: "latest"
		// 	})
		// 	.then((data) => {
		// 		commit("setClaimedAchievements", { data, type })
		// 	})
		// 	.catch((error) => {
		// 		console.log(error)
		// 	})
	},
	async fetchAchievementProcessing({ commit }): Promise<void> {
		await this.$achievementsApi
			.getStatusProcessing()
			.then((data) => {
				commit("setAchievementProcessing", data)
			})
			.catch((error) => {
				console.log(error)
			})
	},
	async fetchPublicProfile({ commit }, id: number): Promise<void> {
		await this.$profileApi
			.getPublicProfile(id)
			.then((data) => {
				commit("setPublicProfile", data)
			})
			.catch((error) => {
				console.error(error)
			})
	},
	async fetchPublicAchievements({ commit }, id: number): Promise<void> {
		await this.$profileApi
			.getPublicAchievements(id)
			.then((data) => {
				commit("setPublicAchievements", data)
			})
			.catch((error) => {
				console.error(error)
			})
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getMe: (state) => state.me,
	getPublicProfile: (state) => state.publicProfile.data,
	getGames: (state) => state.games.items,
	getGamesTotal: (state) => state.games.total,
	getGame: (state) => state.game.data,
	getGameAchievements: (state) => state.game.achievements,
	getAchievements: (state) => state.achievements,
	getPublicAchievements: (state) => state.publicProfile.achievements,
	getIsEmptyAchievements: (state) =>
		Array.isArray(state.achievements) && !state.achievements.length,
	getIsEmptyPublicAchievements: (state) =>
		Array.isArray(state.publicProfile.achievements) &&
		!state.publicProfile.achievements.length,
	getIsAchievementsProcessing: (state) => state.isAchievementsProcessing,
	getAvailableAchievements: (state) => state.availableAchievements
}

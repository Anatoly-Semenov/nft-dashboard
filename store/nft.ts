// Types
import { ActionTree, GetterTree, MutationTree } from "vuex"
import type {
	AirdropService,
	ProfileService,
	NftService,
	ResponseList
} from "@nft-types"

// Lodash
import { cloneDeep } from "lodash"
import walelt from "~/mixins/walelt"

const stateObject = {
	nft: {
		list: null as null | NftService.Nft[],
		detail: null as null | NftService.Nft,
		count: 0 as number
	},
	airdrop: {
		list: null as null | AirdropService.Item[],
		detail: null as null | AirdropService.Item,
		count: 0 as number
	},
	achievementData: {
		activeNftId: null as null | number | number[],
		wallet: null as null | string,
		signature: null as null | string
	},
	signature: null as null | string,
	loading: {
		games: [] as number[],
		nfts: [] as number[]
	},
	balance: 0 as number,
	tokenList: [] as any[]
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setNftList(state, payload: ResponseList<NftService.Nft>): void {
		state.nft.list = payload.items
		state.nft.count = payload.count
	},
	setNftDetail(state, payload: NftService.Nft | null): void {
		state.nft.detail = payload
	},
	setAirdropList(state, payload: AirdropService.Item[]): void {
		state.airdrop.list = payload
	},
	setAirdropDetail(state, payload: AirdropService.Item | null): void {
		state.airdrop.detail = payload
	},
	setSignature(state, payload: string | null): void {
		state.achievementData.signature = payload
	},
	setAchievementWallet(state, payload: string | null): void {
		state.achievementData.wallet = payload
	},
	setActiveNftId(state, payload: number | null): void {
		state.achievementData.activeNftId = payload
	},
	setLoading(
		state,
		{
			type,
			name,
			value
		}: {
			type: "add" | "delete"
			name: "nfts" | "games"
			value: number | number[]
		}
	): void {
		if (type === "add") {
			if (Array.isArray(value)) {
				state.loading[name] = [...state.loading[name], ...value]
			} else {
				state.loading[name].push(value)
			}
		} else {
			if (Array.isArray(value)) {
				value.forEach((id) => {
					const index: number = state.loading[name].findIndex(
						(item) => item === id
					)

					state.loading[name].splice(index, 1)
				})
			} else {
				const index: number = state.loading[name].findIndex(
					(item) => item === value
				)

				state.loading[name].splice(index, 1)
			}
		}
	},
	setBalance(state, payload: number): void {
		state.balance = payload
	},
	setTokenList(state, payload: any[]): void {
		state.tokenList = payload
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
	async fetchNftList({ commit }): Promise<void> {
		await this.$nftApi
			.getNftList()
			.then((data: ResponseList<NftService.Nft>) => {
				commit("setNftList", data)
			})
	},
	async fetchNft({ commit }, id: string): Promise<void> {
		await this.$nftApi.getNft(id).then((data: NftService.Nft) => {
			commit("setNftDetail", data)
		})
	},
	async fetchAirdropList({ commit }): Promise<void> {
		await this.$nftApi.getAirdropList().then((data: ResponseList<any>) => {
			commit("setAirdropList", data)
		})
	},
	async fetchAirdrop({ commit }, id: string): Promise<void> {
		await this.$nftApi.getAirdrop(id).then((data: NftService.Nft) => {
			commit("setAirdropDetail", data)
		})
	},
	async verifyClaim(
		{ commit },
		data: { id: string; wallet: string }
	): Promise<{ signature: string; wallet: string } | null> {
		try {
			const res = await this.$nftApi.verifyClaim(data.id, {
				walletAddress: data.wallet
			})

			commit("setSignature", res.signature)
			commit("setAchievementWallet", res.wallet)

			return res
		} catch (error) {
			// @ts-ignore
			this.$message.error("You didn't get the required achievements")

			commit("setSignature", null)
			commit("setAchievementWallet", null)
			commit("setActiveNftId", null)
			return null
		}
	},
	async fetchBalance({ commit, rootState }) {
		const wallet = (rootState as any).auth.user.walletAddress

		if (!wallet) {
			// @ts-ignore
			this.$message.error("Please sign in first")
			return null
		}

		const balance = await this.$nftContract.methods.balanceOf(wallet).call()
		commit("setBalance", balance)

		const tokenDataList = []

		for (let i = 0; i < balance; i++) {
			const tokenId = await this.$nftContract.methods
				.tokenOfOwnerByIndex(wallet, i)
				.call()

			const metadata = await this.$nftContract.methods
				.tokenURI(parseInt(tokenId, 10))
				.call()

			tokenDataList.push({
				id: parseInt(tokenId, 10),
				metadata
			})
		}

		commit("setTokenList", tokenDataList)
	},
	async mintSingleNft(
		{ commit, state, rootGetters, dispatch },
		data: { nftId: number; gameId: number; wallet: string }
	) {
		commit("setLoading", { type: "add", name: "nfts", value: data.nftId })

		this.$nftContract.methods
			.mint(
				state.achievementData.signature,
				state.achievementData.wallet,
				data.nftId,
				data.gameId
			)
			.send({
				from: rootGetters["auth/getWalletAddress"],
				maxPriorityFeePerGas: null,
				maxFeePerGas: null
			})
			.on("receipt", () => {
				dispatch("fetchBalance")
			})
			.on("error", (error: any) => {
				// @ts-ignore
				this.$message.error(error.message)

				commit("setLoading", {
					type: "delete",
					name: "nfts",
					value: data.nftId
				})
			})
	},
	async mintMultipleNft(
		{ commit, dispatch },
		data: {
			signatures: string[]
			mintWallet: string
			nftList: number[]
			wallet: string
			gameId: number | number[]
		}
	) {
		commit("setLoading", { type: "add", name: "nfts", value: data.nftList })
		commit("setLoading", { type: "add", name: "games", value: data.gameId })

		let gameIds: number[]

		if (typeof data.gameId === "number") {
			gameIds = []

			data.nftList.forEach(() => {
				// @ts-ignore
				gameIds.push(data.gameId)
			})
		} else {
			gameIds = data.gameId
		}

		await this.$nftContract.methods
			.multipleMint(data.signatures, data.mintWallet, data.nftList, gameIds)
			.send({
				from: data.wallet,
				maxPriorityFeePerGas: null,
				maxFeePerGas: null
			})
			.on("receipt", () => {
				dispatch("fetchBalance")
			})
			.on("error", (error: any) => {
				// @ts-ignore
				this.$message.error(error.message)

				commit("setLoading", {
					type: "delete",
					name: "nfts",
					value: data.nftList
				})
				commit("setLoading", {
					type: "delete",
					name: "games",
					value: data.gameId
				})
			})
	},
	async claim(
		{ state, rootState, rootGetters, dispatch, commit },
		{ nftId, mintWallet }: { nftId: number; mintWallet: string }
	) {
		let nft: NftService.Nft | null = null
		let gameId: number | null = null

		// @ts-ignore
		const achievementsIndexList = rootState.profile.achievements
		// @ts-ignore
		const achievementsGameList = rootState.profile.game.achievements

		if (achievementsIndexList) {
			achievementsIndexList.forEach(
				({ achievements, game }: ProfileService.Achievement) => {
					achievements.forEach(
						({ nfts }: ProfileService.ProfileAchievement) => {
							nfts!.forEach((item) => {
								if (item.id === nftId) {
									nft = item
									gameId = game.id
								}
							})
						}
					)
				}
			)
		} else if (achievementsGameList) {
			achievementsGameList.forEach(
				({ nfts }: ProfileService.ProfileAchievement) => {
					nfts!.forEach((item) => {
						if (item.id === nftId) {
							nft = item
						}
					})
				}
			)

			gameId = rootGetters["games/getGameId"]
		}

		if (!nft) {
			return null
		}

		commit("setActiveNftId", nftId)

		await dispatch("verifyClaim", { id: nftId, wallet: mintWallet })

		if (state.achievementData.signature && state.achievementData.wallet) {
			await dispatch("mintSingleNft", {
				nftId: nftId,
				gameId: gameId,
				wallet: mintWallet
			})
		}
	},
	async claimMultiple(
		{ state, rootState, dispatch, commit },
		{
			nftIds,
			gameID,
			mintWallet
		}: { nftIds: number[]; gameID?: number | number[]; mintWallet: string }
	) {
		const wallet = (rootState as any).auth.user.walletAddress

		commit("setActiveNftId", nftIds)

		if (!wallet) {
			// @ts-ignore
			this.$message.error("Please sign in first")
			return null
		}

		const nftList: NftService.Nft[] = []
		let gameId: number | number[] = Array.isArray(gameID) ? [] : 0

		// @ts-ignore
		const profileState: any = rootState.profile

		if (profileState?.achievements?.length) {
			// @ts-ignore
			profileState.achievements.forEach(
				({ achievements, game }: ProfileService.Achievement) => {
					achievements.forEach(
						({ nfts }: ProfileService.ProfileAchievement) => {
							nfts!.forEach((item) => {
								if (nftIds.includes(item.id)) {
									nftList.push(item)

									if (Array.isArray(gameId)) {
										gameId.push(game.id)
									} else if (gameId === 0) {
										gameId = game.id
									}
								}
							})
						}
					)
				}
			)
		} else if (profileState.game?.achievements?.length) {
			// @ts-ignore
			profileState.game.achievements.forEach(
				({ nfts }: ProfileService.ProfileAchievement) => {
					nfts!.forEach((item) => {
						if (nftIds.includes(item.id)) {
							nftList.push(item)
						}
					})
				}
			)

			gameId = gameID || 0
		}

		if (!nftList?.length) {
			return null
		}

		const signQueries = nftList.map((nft) =>
			dispatch("verifyClaim", { id: nft.id, mintWallet })
		)

		const signResponse = await Promise.all(signQueries)

		const data = signResponse.reduce(
			({ signatures, wallets }, res) => ({
				signatures: [...signatures, res.signature]
			}),
			{
				signatures: []
			}
		)

		await dispatch("mintMultipleNft", {
			signatures: data.signatures,
			mintWallet: mintWallet,
			nftList: nftList.map((nft) => nft.id),
			wallet,
			gameId
		})
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getNftList: (state) => state.nft.list,
	getNft: (state) => state.nft.detail,
	getAirdropList: (state) => state.airdrop.list,
	getAirdrop: (state) => state.airdrop.detail,
	getBalance: (state) => state.balance,
	getTokenList: (state) => state.tokenList,
	getLoadingIds: (state) => (type: "games" | "nfts", value: number) =>
		state.loading[type].includes(value)
}

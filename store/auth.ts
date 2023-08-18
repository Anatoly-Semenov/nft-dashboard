// Types
import type { MutationTree, ActionTree, GetterTree } from "vuex"
import type { SocialService, UserService } from "@sk-types"

// Lodash
import { cloneDeep } from "lodash"

const stateObject = {
	loading: false,
	addableMode: false,
	redirectUrl: "",
	accessToken: "",
	user: {} as UserService.User,
	wallets: [] as UserService.UserWallet[],
	referralId: 0
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setAccessToken(state, token: string): void {
		state.accessToken = token
	},
	setUserData(state, user: UserService.User): void {
		state.user = user
	},
	clearUserData(state): void {
		state.user = {} as UserService.User
	},
	setNonce(state, nonce: string): void {
		state.user.nonce = nonce
	},
	setWalletAddress(state, address: string): void {
		state.user.walletAddress = address
	},
	setWallets(state, wallets: UserService.UserWallet[]): void {
		const mainWalletAddress: string = state.user.walletAddress

		const hasMainWallet: boolean =
			state.wallets?.[0]?.wallet === mainWalletAddress ||
			wallets.findIndex(({ wallet }) => wallet === mainWalletAddress) > -1

		const mainWallet: UserService.UserWallet = {
			id: "main",
			wallet: state.user.walletAddress,
			is_verified: true,
			updatedAt: "2022-05-30T10:32:58.473Z",
			createdAt: "2022-05-30T10:32:58.473Z"
		}

		if (!hasMainWallet) {
			state.wallets = [mainWallet, ...wallets]
		} else {
			state.wallets = wallets
		}
	},
	addWallet(state, wallet: UserService.UserWallet): void {
		state.wallets = [...state.wallets, wallet]
	},
	verifyWallet(state, wallet: string): void {
		const index: number = state.wallets.findIndex(
			(item) => item.wallet === wallet
		)

		state.wallets[index].is_verified = true
	},
	setLoading(state, loading: boolean): void {
		state.loading = loading
	},
	setAddableMode(state, isAddable: boolean): void {
		state.addableMode = isAddable
	},
	setRedirectUrl(state, url: string): void {
		state.redirectUrl = url
	},
	setReferralId(state, payload: number): void {
		state.referralId = payload
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
	async fetchWalletAddress({ commit }): Promise<string> {
		if (!window.ethereum) {
			throw new Error("Metamask is not installed")
		}

		let accounts = await window.ethereum.request({
			method: "eth_requestAccounts"
		})

		if (!accounts.length && !accounts[0] && window.ethereum) {
			accounts = await window.ethereum.enable()
		}

		// commit("setWalletAddress", accounts[0])
		return accounts[0]
	},
	async fetchWalletList({ commit }) {
		commit("setLoading", true)

		await this.$userApi
			.getWalletList()
			.then((data) => {
				commit("setWallets", data)
			})
			.finally(() => {
				commit("setLoading", false)
			})
	},
	async createNonce({ commit }, walletAddress: string) {
		commit("setLoading", true)

		try {
			const { nonce } = await this.$authApi.createNonce({ walletAddress })
			commit("setNonce", nonce)
		} catch (error) {
			commit("setNonce", "")
		} finally {
			commit("setLoading", false)
		}
	},
	async addWallet({ commit }, walletAddress: string) {
		this.$message.loading({ content: "Adding a new wallet", key: 1 })

		try {
			commit("setLoading", true)

			const wallet = await this.$userApi.addWallet(walletAddress)

			commit("addWallet", wallet)

			this.$message.success({ content: "Wallet added successfully", key: 1 })
		} catch (error) {
			this.$message.error({ content: `Failed to verify wallet`, key: 1 })
		} finally {
			commit("setLoading", false)
		}
	},
	async deleteWallet({ commit, state }, walletAddress: string) {
		try {
			commit("setLoading", true)

			await this.$userApi.deleteWallet(state.user.id, walletAddress)
			commit(
				"setWallets",
				state.wallets.filter((el) => el.wallet !== walletAddress)
			)
		} catch (error) {
			this.$message.error(`Failed to verify wallet`)
		} finally {
			commit("setLoading", false)
		}
	},
	async verifyWallet({ state, commit }, wallet: string) {
		commit("setLoading", true)

		const nonce = state.user.nonce

		if (!nonce) {
			return false
		}

		const message = `sign_message` + wallet + nonce

		await this.$web3.eth.personal
			.sign(message, wallet, nonce)
			.then(async (signature) => {
				await this.$userApi
					.verifyWallet(state.user.id, wallet, {
						nonce,
						signature
					})
					.then((response) => {
						if (response.status === "success") {
							commit("verifyWallet", wallet)
						}
					})
					.catch(() => {
						this.$message.error(`Failed to verify wallet`)
					})
			})
			.catch((error) => {
				if (error.code === 4100) {
					this.$message.error("This wallet is not connected in metamask")
				}
			})

		commit("setLoading", false)
	},
	async authUser(
		{ state, commit, dispatch },
		payload: {
			walletAddress?: string
			solanaAccount?: string
			solanaSignature?: string
		}
	) {
		commit("setLoading", true)

		try {
			const {
				walletAddress = "",
				solanaAccount = "",
				solanaSignature = ""
			} = payload

			const params: any = {}

			if (walletAddress) {
				params.walletAddress = walletAddress
			} else if (solanaAccount && solanaSignature) {
				params.solanaAccount = solanaAccount
				params.solanaSignature = solanaSignature
			}

			const referralId = state.referralId

			if (referralId) {
				params.referralId = referralId
			}

			if (Object.keys(params).length) {
				const { accessToken } = await this.$authApi.signIn(params)

				this.$fb.track("Lead")

				this.$authApi.setAccessToken(accessToken)
				commit("setAccessToken", accessToken)
				dispatch("fetchCurrentUser")
			}

			// Send amplitude data
			if (referralId) {
				await this.$amplitude.customEvent("new_referral_user", {
					referral_id: referralId,
					new_user_id: state.user?.id || null
				})
			}
		} catch (error) {
			this.$logout()
			commit("setAccessToken", "")
		} finally {
			commit("setLoading", false)
		}
	},
	async accountsChanged({ dispatch, state }, walletAddress: string) {
		this.$logout()
		dispatch("authUser", walletAddress)
	},
	async fetchCurrentUser({ commit }) {
		commit("setLoading", true)

		try {
			const user = await this.$userApi.getCurrent()

			// @ts-ignore
			this.$amplitude.setUserId(user.id)

			commit("setUserData", user)
		} catch (e) {
			commit("clearUserData")
		} finally {
			commit("setLoading", false)
		}
	},
	async connectSocialAccount(
		{ state, commit },
		data: {
			provider: SocialService.ServiceList
			params: Record<string, string>
		}
	) {
		commit("setLoading", true)

		const user = await this.$userApi.connectSocial(
			state.user.id,
			data.provider,
			data.params
		)

		commit("setUserData", user)
		commit("setLoading", false)
	},
	async authUserBySocial(
		{ commit },
		data: {
			provider: SocialService.ServiceList
			params: Record<string, string>
		}
	) {
		commit("setLoading", true)

		try {
			const { accessToken } = await this.$authApi.signBySocial(data)

			this.$authApi.setAccessToken(accessToken)
			commit("setAccessToken", accessToken)
		} catch (error) {
			this.$logout()
			commit("setAccessToken", "")
		} finally {
			commit("setLoading", false)
		}
	},
	async updateUser({ commit, state }, data: Partial<UserService.User>) {
		if (!state.user.id) return
		commit("setLoading", true)

		await this.$userApi.update(state.user.id, data)
		commit("setUserData", { ...state.user, ...data })
		commit("setLoading", false)
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getWalletAddress: (state) => state.user.walletAddress,
	getSteam: (state) => state.user.steam,
	getEpicGames: (state) => state.user.epicGames,
	getWallets: (state) => state.wallets,
	getRedirectUrl: (state) => state.redirectUrl,
	getNonce: (state) => state.user.nonce,
	getUser: (state): UserService.User => state.user,
	getUserId: (state, getters) => getters.getUser.id || "",
	getIsMetamaskAuth: (state): boolean =>
		!!(state.user.walletAddress && state.user.id),
	getIsSolanaAuth: (state): boolean =>
		!!(state.user.solanaAccount && state.user.id),
	getIsAuth: (state, getters): boolean =>
		getters.getIsMetamaskAuth || getters.getIsSolanaAuth,
	getIsAddableMode: (state): boolean => state.addableMode
}

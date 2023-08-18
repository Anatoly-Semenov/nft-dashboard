import { ActionTree, GetterTree, MutationTree } from "vuex"

// Lodash
import { cloneDeep } from "lodash"

// Types
import { ReferralService, Meta, ResponseListMeta } from "@nft-types"
type UsersResponse = ResponseListMeta<ReferralService.User>

const stateObject = {
	total: {
		users: 0,
		balance: 0,
		achievements: 0
	} as ReferralService.Total,
	users: {
		data: null as null | ReferralService.Users,
		meta: {
			total_items: 0,
			total_pages: 0,
			current_page: 0
		} as Meta
	}
}

export const state = () => cloneDeep(stateObject)

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
	setTotal(state, payload: ReferralService.Total): void {
		state.total = payload
	},
	setUsers(state, { data, meta }: UsersResponse): void {
		meta.current_page = +meta.current_page

		state.users.data = data
		state.users.meta = meta
	}
}

export const actions: ActionTree<RootState, RootState> = {
	async fetchTotal({ commit }): Promise<void> {
		this.$referralApi
			.getTotal()
			.then((data) => {
				commit("setTotal", data)
			})
			.catch((error: any) => {
				console.error(error)
			})
	},
	async fetchUsers({ commit }, { page = 1, limit = 25 }): Promise<void> {
		await this.$referralApi
			.getUsers(page, limit)
			.then((data) => {
				commit("setUsers", data)
			})
			.catch((error: any) => {
				console.error(error)
			})
	}
}

export const getters: GetterTree<RootState, RootState> = {
	getTotal: (state) => state.total,
	getUsers: (state) => state.users.data,
	getUsersMeta: (state) => state.users.meta
}

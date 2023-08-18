import type { ProfileService } from "@nft-types"

// @ts-ignore
const gamesList: ProfileService.Game[] = [0, 1, 2, 3, 4].map((index) => {
	return {
		game: {
			id: index,
			title: "loading",
			min_investment_token: 1,
			token_title: "loading",
			release_date: "loading",
			chain_title: "loading",
			description: "loading",
			in_use: true,
			site: "loading",
			image: "loading",
			logo: "loading",
			is_upcoming: true,
			is_on_chain: true,
			genre: "RPG",
			code: "string"
		},
		stats: {
			spend: 10,
			earn: 10,
			points: 10,
			roi: 0.1
		},
		isActive: true
	}
})

export default gamesList

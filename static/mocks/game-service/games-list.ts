import type { GameService } from "@nft-types"

const gamesList: GameService.Game[] = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
	return {
		id: index,
		title: "Cyball",
		logo: "https://miro.medium.com/max/640/1*E5dfZVe1b_8IxsKk-1aaww.jpeg",
		stats: {
			new_users: 7,
			profit: 57.14285714285714,
			avg_roi: -0.2764152262635084,
			risk_level: "high",
			twitter: {
				date: "2022-09-04T00:00:00",
				members_count: 59647,
				members_growth: 59647,
				members_growth_percentage: 0,
				members_online_count: 0
			}
		}
	}
})

export default gamesList

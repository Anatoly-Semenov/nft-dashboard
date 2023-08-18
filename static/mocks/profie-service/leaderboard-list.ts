import type { ProfileService } from "@nft-types"

const leaderboardList: ProfileService.LeaderboardData = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
].map((index) => {
	return {
		avatar: "",
		earned_achievements: 0,
		games: 0,
		name: "Loading",
		points: 0,
		total_achievements: 0,
		user_id: index,
		wallet: "Loading"
	}
})

export default leaderboardList

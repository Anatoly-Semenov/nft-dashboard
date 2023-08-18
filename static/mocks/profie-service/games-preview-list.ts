import type { ProfileService } from "@nft-types"

const gamesPreviewList: ProfileService.GamePreviewResponse = [
	0, 1, 2, 3, 4
].map((index) => {
	return {
		id: index,
		title: "loading",
		logo: "loading",
		players: 10,
		earnedAchievements: 10,
		achievements: 10
	}
})

export default gamesPreviewList

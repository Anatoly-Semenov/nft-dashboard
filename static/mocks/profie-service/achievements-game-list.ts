import type { ProfileService } from "@sk-types"

const profileAchievementsGameList: ProfileService.ProfileAchievement[] = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9
].map((index) => {
	return {
		id: index,
		name: "Spend $100",
		scores: 10,
		rules: [
			{ key: "spend", value: "-100", operand: "lte", handler: "SPEND_USD" }
		],
		updatedAt: "2022-08-29T04:12:04.146Z",
		createdAt: "2022-08-29T04:09:27.130Z",
		nfts: [
			{
				id: 11,
				name: "Cyball Investor 1",
				description: "Invested $100 in Cyball on a single account",
				image: "https://i.ibb.co/DzrY79y/Spent-100-2x.png",
				shortDescription: "Invested $100 in Cyball on a single account",
				chain: "BSC",
				count: 1000000000,
				expiredAt: "null",
				updatedAt: "2022-10-09T10:39:16.000Z",
				createdAt: "2022-10-09T10:39:16.000Z"
			}
		],
		status: "NOT_CLAIMED"
	}
})

export default profileAchievementsGameList

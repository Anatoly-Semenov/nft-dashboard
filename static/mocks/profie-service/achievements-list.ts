import type { ProfileService } from "@nft-types"

// @ts-ignore
const achievementsList: ProfileService.Achievement[] = [0, 1, 2, 3].map(
	(index) => {
		return {
			game: {
				id: index,
				title: "Fortnite",
				// @ts-ignore
				description:
					"Fortnite is a free-to-play Battle Royale game with numerous game modes for every type of game player. Watch a concert, build an island or fight.",
				genre: "null",
				logo: "null",
				image:
					"https://gamingintel.com/wp-content/uploads/2022/06/Fortnite-v21.10-all-leaks-naruto-skins-lightsabers-more.jpg.webp",
				site: "https://www.epicgames.com/fortnite/en-US/home",
				min_investment_token: 0,
				token_title: "USD",
				release_date: "2021-01-01",
				chain_title: "bsc",
				in_use: false,
				is_upcoming: false,
				is_on_chain: false,
				code: "FORTNITE",
				chains: "null",
				background_image: "null"
			},
			achievements: [
				{
					id: 1,
					name: "Have total KD more than 1.0",
					scores: 1,
					rules: [{ key: "kd", value: "1", operand: "gte", handler: "any" }],
					updatedAt: "2022-05-30T10:26:59.866Z",
					createdAt: "2022-05-30T10:06:57.925Z",
					nfts: [
						{
							id: 2,
							name: "No time to die",
							description:
								"If you’ve ever wondered whether an avocado is a fruit or a vegetable, you’ve come to the right place. To answer your question: Yes, avocados are fruits. More specifically, though, they’re berries. They also known as an alligator pear or butter fruit. No matter what you call them, avocados are incredibly",
							image: "https://i.ibb.co/Dt3F61z/fortnite-4.png",
							shortDescription: "Have total KD more than 1.0",
							chain: "BSC",
							count: 10000,
							expiredAt: "2022-06-06T10:36:22.943Z",
							updatedAt: "2022-05-30T10:36:23.194Z",
							createdAt: "2022-05-30T10:36:23.194Z"
						}
					],
					status: "CLAIMED"
				},
				{
					id: 2,
					name: "Have an account in Fortnite that is registered more than 7 days ago",
					scores: 1,
					rules: [],
					updatedAt: "2022-05-30T10:28:39.045Z",
					createdAt: "2022-05-30T10:28:39.045Z",
					nfts: [
						{
							id: 1,
							name: "Started the journey",
							description:
								"If you’ve ever wondered whether an avocado is a fruit or a vegetable, you’ve come to the right place. To answer your question: Yes, avocados are fruits. More specifically, though, they’re berries. They also known as an alligator pear or butter fruit. No matter what you call them, avocados are incredibly",
							image: "https://i.ibb.co/Dt3F61z/fortnite-4.png",
							shortDescription: "Play at least one battle royale match",
							chain: "BSC",
							count: 10000,
							expiredAt: "2022-06-06T10:35:58.484Z",
							updatedAt: "2022-05-30T10:35:58.730Z",
							createdAt: "2022-05-30T10:35:58.730Z"
						}
					],
					status: "CLAIMED"
				},
				{
					id: 3,
					name: "Play at least one battle royale match",
					scores: 1,
					rules: [
						{ key: "matches", value: "1", operand: "gte", handler: "any" }
					],
					updatedAt: "2022-05-30T10:30:59.563Z",
					createdAt: "2022-05-30T10:30:34.388Z",
					nfts: [
						{
							id: 1,
							name: "Started the journey",
							description:
								"If you’ve ever wondered whether an avocado is a fruit or a vegetable, you’ve come to the right place. To answer your question: Yes, avocados are fruits. More specifically, though, they’re berries. They also known as an alligator pear or butter fruit. No matter what you call them, avocados are incredibly",
							image: "https://i.ibb.co/Dt3F61z/fortnite-4.png",
							shortDescription: "Play at least one battle royale match",
							chain: "BSC",
							count: 10000,
							expiredAt: "2022-06-06T10:35:58.484Z",
							updatedAt: "2022-05-30T10:35:58.730Z",
							createdAt: "2022-05-30T10:35:58.730Z"
						}
					],
					status: "DISABLED"
				},
				{
					id: 4,
					name: "Have total winrate mora than 10%",
					scores: 1,
					rules: [
						{ key: "winRate", value: "10", operand: "gte", handler: "any" }
					],
					updatedAt: "2022-05-30T10:31:42.759Z",
					createdAt: "2022-05-30T10:31:19.585Z",
					nfts: [
						{
							id: 3,
							name: "Master Survivor",
							description:
								"If you’ve ever wondered whether an avocado is a fruit or a vegetable, you’ve come to the right place. To answer your question: Yes, avocados are fruits. More specifically, though, they’re berries. They also known as an alligator pear or butter fruit. No matter what you call them, avocados are incredibly",
							image: "https://i.ibb.co/z6xdfNV/fortnite-3.png",
							shortDescription: "Have total winrate mora than 10%",
							chain: "BSC",
							count: 10000,
							expiredAt: "2022-06-06T10:36:50.616Z",
							updatedAt: "2022-05-30T10:36:50.850Z",
							createdAt: "2022-05-30T10:36:50.850Z"
						}
					],
					status: "DISABLED"
				}
			]
		}
	}
)

export default achievementsList

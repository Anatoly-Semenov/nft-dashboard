import type { RewardsService } from "@sk-types"

const rewards: RewardsService.Response = {
	link: "google.com",
	date: "loading - loading",
	list: [0, 1, 2].map((index) => {
		return {
			id: index,
			name: "Lorem Ipsum dlor",
			amount: 1,
			currency: "loading",
			image: "loading",
			link: "loading",
			description: "loading desc",
			startedAt: "loading",
			endedAt: "loading",
			createdAt: "loading"
		}
	})
}

export default rewards

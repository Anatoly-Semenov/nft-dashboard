import type { GameService } from "@sk-types"

// @ts-ignore
const upcomingGamesList: GameService.UpcomingGame[] = [
	0, 1, 2, 3, 4, 5, 6, 7, 8, 9
].map((id) => {
	return {
		id: id,
		ino_date: "Loading",
		ido_date: "Loading",
		ido_status: "Loading",
		is_upcoming: true,
		logo: "Loading",
		marketplace: "Loading",
		release_date: "Loading",
		release_status: "Loading",
		site: "Loading",
		title: "Loading",
		token: "Loading",
		links: [],
		communities: {
			twitter: null,
			discord: null,
			telegram: null
		}
	}
})

export default upcomingGamesList

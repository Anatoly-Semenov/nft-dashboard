import type { GameService } from "@sk-types"

const gamesList: GameService.GameDetail = {
	id: 2,
	title: "Cyball",
	min_investment_token: 5,
	token_title: "CBT",
	release_date: "2021-01-01",
	chain_title: "bsc",
	chains: "null",
	description:
		"Cyball is an autobatler game, where you get a team of 3 cyblocs and participate in matches against others. You can breed CyBlocs by mentoring and sell them on marketplace. Game is on bnb smart chain.",
	in_use: true,
	site: "https://cyball.com/",
	image:
		"https://i0.wp.com/coin68.com/wp-content/uploads/2021/09/du-an-cyball-1200x675.jpg?resize=640%2C360&ssl=1",
	background_image: "null",
	is_upcoming: false,
	logo: "https://miro.medium.com/max/640/1*E5dfZVe1b_8IxsKk-1aaww.jpeg",
	code: "CYBALL",
	genre: "null",
	stats: {
		new_users: 7,
		profit: 57.14285714285714,
		avg_roi: -0.2764152262635084,
		risk_level: "high",
		players_count: 7350
	},
	links: [
		{
			id: 6,
			game_id: 2,
			channel: "https://t.me/CyBallOfficial",
			service: "TELEGRAM"
		},
		{
			id: 4,
			game_id: 2,
			channel:
				"https://discord.com/api/v9/invites/cyball?with_counts=true&with_expiration=true",
			service: "DISCORD"
		},
		{
			id: 2,
			game_id: 2,
			channel: "https://twitter.com/CyBallOfficial",
			service: "TWITTER"
		}
	]
}

export default gamesList

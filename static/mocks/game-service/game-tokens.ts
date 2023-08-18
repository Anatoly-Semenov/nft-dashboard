import type { GameService } from "@nft-types"

const gameTokens: GameService.TokenContract[] = [0, 1].map((index) => {
	return {
		id: index,
		title: "Cyball coin",
		address: "0x7c73967dc8c804ea028247f5a953052f0cd5fd58",
		market_cap: 12,
		market_cap_delta: 10,
		price: 0.00212115,
		price_delta: -3.96577,
		image:
			"https://assets.coingecko.com/coins/images/24167/large/CBT_200x200.png?1646714918",
		ticker: "CBT"
	}
})

export default gameTokens

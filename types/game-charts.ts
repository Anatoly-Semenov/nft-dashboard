import type { GameService } from "@nft-types"

export type SeriesNameEconomic =
	| "earning"
	| "users"
	| "average"
	| "nft"
	| "spendingEarning"
	| "spendersEarners"
	| "burnMint"

export type SeriesNameSocial = "twitter" | "discord" | "telegram"

export type SeriesName = SeriesNameEconomic | SeriesNameSocial

export type Series = string[][] | number[][]

export interface EconomicSeries {
	users: GameService.UsersByDate
	average: GameService.AverageEarnings
	nft: GameService.NftTrades
	spendingEarning: GameService.SpendingAndEarnings
	spendersEarners: GameService.SpendersAndEarners
	burnMint: GameService.NtfBurnAndMint
}

export type ChartType = "economic" | "social"

export interface FetchParams {
	name: SeriesName
	type: ChartType
}

export interface SeriesParams extends FetchParams {
	data: any // todo
}

export interface StatisticParams extends FetchParams {
	data: any // todo
}

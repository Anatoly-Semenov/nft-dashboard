export interface GameProfile {
	logo: string
	title: string
	chains: string
	genre: string
	playersCount?: number | string
}

export type ProfileType = "public" | "private"

export type SortOrder = "ascend" | "descend" | "reset"

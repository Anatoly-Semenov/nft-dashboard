import {
	AuthService,
	AnalyticsService,
	ArticlesService,
	AchievementsService,
	UserService,
	NftService,
	SocialService,
	GameService,
	ProfileService,
	FeedbackService,
	RewardsService,
	ReferralService,
	AirdropMaticService
} from "@sk-requests"

// types
import type { Plugin } from "@nuxt/types"
import type { NuxtCookies } from "cookie-universal-nuxt"

declare module "vue/types/vue" {
	interface Vue {
		$authApi: AuthService
		$analyticsApi: AnalyticsService
		$articlesApi: ArticlesService
		$achievementsApi: AchievementsService
		$userApi: UserService
		$nftApi: NftService
		$socialApi: SocialService
		$gameApi: GameService
		$profileApi: ProfileService
		$feedbackApi: FeedbackService
		$rewardsApi: RewardsService
		$referralApi: ReferralService
		$airdropMaticApi: AirdropMaticService
	}
}

declare module "@nuxt/types" {
	interface NuxtAppOptions {
		$authApi: AuthService
		$analyticsApi: AnalyticsService
		$articlesApi: ArticlesService
		$achievementsApi: AchievementsService
		$userApi: UserService
		$nftApi: NftService
		$socialApi: SocialService
		$gameApi: GameService
		$profileApi: ProfileService
		$feedbackApi: FeedbackService
		$rewardsApi: RewardsService
		$referralApi: ReferralService
		$airdropMaticApi: AirdropMaticService
		$cookies: NuxtCookies
	}

	interface Context {
		$authApi: AuthService
		$analyticsApi: AnalyticsService
		$articlesApi: ArticlesService
		$achievementsApi: AchievementsService
		$userApi: UserService
		$nftApi: NftService
		$socialApi: SocialService
		$gameApi: GameService
		$profileApi: ProfileService
		$feedbackApi: FeedbackService
		$rewardsApi: RewardsService
		$referralApi: ReferralService
		$airdropMaticApi: AirdropMaticService
	}
}

declare module "vuex/types/index" {
	interface Store<S> {
		$authApi: AuthService
		$analyticsApi: AnalyticsService
		$articlesApi: ArticlesService
		$achievementsApi: AchievementsService
		$userApi: UserService
		$nftApi: NftService
		$socialApi: SocialService
		$gameApi: GameService
		$profileApi: ProfileService
		$feedbackApi: FeedbackService
		$rewardsApi: RewardsService
		$referralApi: ReferralService
		$airdropMaticApi: AirdropMaticService
	}
}

const apiPlugin: Plugin = (ctx, inject) => {
	const userService = new UserService(ctx)
	const authService = new AuthService(ctx)
	const nftService = new NftService(ctx)
	const socialService = new SocialService(ctx)
	const gameService = new GameService(ctx)
	const profileService = new ProfileService(ctx)
	const feedbackService = new FeedbackService(ctx)
	const analyticsService = new AnalyticsService(ctx)
	const articlesService = new ArticlesService(ctx)
	const achievementsService = new AchievementsService(ctx)
	const rewardsService = new RewardsService(ctx)
	const referralService = new ReferralService(ctx)
	const airdropMaticService = new AirdropMaticService(ctx)

	inject("userApi", userService)
	inject("authApi", authService)
	inject("nftApi", nftService)
	inject("socialApi", socialService)
	inject("gameApi", gameService)
	inject("profileApi", profileService)
	inject("feedbackApi", feedbackService)
	inject("analyticsApi", analyticsService)
	inject("articlesApi", articlesService)
	inject("achievementsApi", achievementsService)
	inject("rewardsApi", rewardsService)
	inject("referralApi", referralService)
	inject("airdropMaticApi", airdropMaticService)
}

export default apiPlugin

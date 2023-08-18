import Vue from "vue"
import { mapGetters } from "vuex"

// Types
import { GameService } from "@nft-types"

interface Link {
	icon: any
	text: string
	link: string
}

// Icons
const iconDiscord = () =>
	import(
		/* webpackChunkName: "icon-discord" */ "~/assets/img/icons/social/icon-discord.svg"
	)
const iconTwitter = () =>
	import(
		/* webpackChunkName: "icon-twitter" */ "~/assets/img/icons/social/icon-twitter.svg"
	)
const iconTelegram = () =>
	import(
		/* webpackChunkName: "icon-telegram */ "~/assets/img/icons/social/icon-telegram.svg"
	)
const iconFacebook = () =>
	import(
		/* webpackChunkName: "icon-facebook */ "~/assets/img/icons/social/icon-facebook.svg"
	)
const iconYoutube = () =>
	import(
		/* webpackChunkName: "icon-youtube" */ "~/assets/img/icons/social/icon-youtube.svg"
	)
const iconTiktok = () =>
	import(
		/* webpackChunkName: "icon-tiktok" */ "~/assets/img/icons/social/icon-tiktok.svg"
	)
const iconMedium = () =>
	import(
		/* webpackChunkName: "icon-medium" */ "~/assets/img/icons/social/icon-medium.svg"
	)

export default Vue.extend({
	props: {
		isUpcoming: {
			type: Boolean,
			default: false
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters({
			getGameWebsite: "games/getGameWebsite",
			getGameLinks: "games/getGameLinks"
		}),
		site(): string {
			return this.getGameWebsite(this.isUpcoming)
		},
		socials(): GameService.Link[] {
			return this.getGameLinks(this.isUpcoming)
		},
		linksLoadingList(): Link[] {
			return [0, 1, 2, 3, 4].map(() => {
				return {
					icon: "loading",
					text: "loading",
					link: "loading"
				}
			})
		},
		linksList(): Link[] {
			const links: { icon: any; text: string; link: string }[] = []

			if (this.socials.length) {
				this.socials.forEach(({ service, channel }: any) => {
					switch (service) {
						case "TWITTER":
							links.push({
								icon: iconTwitter,
								text: "Twitter",
								link: channel
							})

							break
						case "DISCORD":
							links.push({
								icon: iconDiscord,
								text: "Discord",
								link: channel
							})

							break
						case "TELEGRAM":
							links.push({
								icon: iconTelegram,
								text: "Telegram",
								link: channel
							})
							break
						case "FACEBOOK":
							links.push({
								icon: iconFacebook,
								text: "Facebook",
								link: channel
							})
							break
						case "YOUTUBE":
							links.push({
								icon: iconYoutube,
								text: "Youtube",
								link: channel
							})
							break
						case "TIKTOK":
							links.push({
								icon: iconTiktok,
								text: "Tiktok",
								link: channel
							})
							break
						case "MEDIUM":
							links.push({
								icon: iconMedium,
								text: "Medium",
								link: channel
							})
							break
					}
				})
			}

			return links
		},
		links(): Link[] {
			return this.isLoading ? this.linksLoadingList : this.linksList
		}
	}
})

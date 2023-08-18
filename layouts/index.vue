<template>
	<div class="layout">
		<div class="layout__container">
			<layout-header :screenWidth="screenWidth" :menu="menu" />
			<div class="layout__content" :class="{ _profile: isProfile }">
				<template v-if="isProfile">
					<div class="layout__content-profile">
						<Nuxt v-if="isDesktop" />
						<layout-profile v-else isNotDesktop>
							<Nuxt />
						</layout-profile>
					</div>
					<layout-profile v-if="isDesktop" />
				</template>
				<Nuxt v-else />
			</div>
			<layout-social />
			<layout-footer />
			<div class="layout__menu" v-if="screenWidth > 0 && screenWidth < 800">
				<template v-for="{ text, route, iconType, iconName, action } in menu">
					<component
						class="layout__menu-item"
						:key="text"
						:is="text !== 'Home' ? 'nuxt-link' : 'button'"
						:to="!!route ? route : '/'"
						@click="action"
					>
						<ui-icon v-if="iconType" :type="iconType" theme="filled" />
						<component v-else :is="iconName" />

						<span>{{ text }}</span>
					</component>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import widthMixin from "~/mixins/width"
import { listenMetamaskEventsMixin } from "~/mixins/web3"
import { listenPhantomEventsMixin } from "~/mixins/phantom"

// Components
import layoutHeader from "~/components/layout/layout-header.vue"
import layoutFooter from "~/components/layout/layout-footer.vue"
const layoutSocial = () =>
	import(
		/* webpackChunkName: "layout-social" */ "~/components/layout/layout-social.vue"
	)
const layoutProfile = () =>
	import(
		/* webpackChunkName: "layout-profile" */ "~/components/layout/layout-profile.vue"
	)

// Icons
const iconDashboard = () =>
	import(
		/* webpackChunkName: "icon-dashboard" */ "~/assets/img/icons/icon-dashboard.svg"
	)
const iconGame = () =>
	import(/* webpackChunkName: "icon-game" */ "~/assets/img/icons/icon-game.svg")

const iconCup = () =>
	import(/* webpackChunkName: "icon-cup" */ "~/assets/img/icons/icon-cup.svg")

// Types
import { MenuItem } from "~/types/layout"

export default mixins(
	widthMixin,
	listenMetamaskEventsMixin,
	listenPhantomEventsMixin
).extend({
	name: "index-layout",
	components: {
		layoutHeader,
		layoutFooter,
		layoutSocial,
		layoutProfile
	},
	mounted(): void {
		const errorMessage = this.$cookies.get("error-message")

		if (errorMessage) {
			// For debugging error on prod
			console.error(errorMessage.toString())

			this.$cookies.remove("error-message")
			this.$notification.error({
				message: "Connect error",
				description: errorMessage.toString()
			})
		}
	},
	computed: {
		isProfile(): boolean {
			return this.$route.name?.toLowerCase().includes("profile") || false
		},
		isDesktop(): boolean {
			return this.screenWidth > 1320
		},
		menu(): MenuItem[] {
			return [
				{
					text: "Home",
					route: null,
					action: () => window.open(process.env.LANDING_PAGE_LINK, "_self")!,
					iconType: "home"
				},
				{
					text: "Dashboard",
					route: "/dashboard",
					iconName: iconDashboard,
					action: () => {}
				},
				{
					text: "Calendar",
					route: "/calendar",
					iconType: "calendar",
					action: () => {}
				},
				{
					text: "Leaderboard",
					route: "/leaderboard",
					iconName: iconCup,
					action: () => {}
				}
				// Todo: Temporary hide
				// {
				// 	text: "NFT",
				// 	route: "/nft",
				// 	iconType: "usb"
				// },
				// {
				// 	text: "CRM",
				// 	route: "/crm-beta",
				// 	iconName: iconGame
				// }
			]
		}
	}
})
</script>

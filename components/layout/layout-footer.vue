<template>
	<div class="layout__footer">
		<div class="layout__footer-main">
			<nuxt-link class="layout__footer-logo" to="/">
				<icon-logo />
			</nuxt-link>
			<div class="layout__footer-contacts">
				<ui-tooltip
					v-for="item in social"
					:key="item.text"
					:title="item.text"
					placement="top"
				>
					<a class="layout__footer-button" :href="item.link" target="_blank">
						<component :is="item.icon" />
					</a>
				</ui-tooltip>
			</div>
		</div>
		<div class="layout__footer-completion">
			<span>© 2022 SkillLabs</span>
			<nuxt-link to="/privacy"><span>Privacy Policу</span></nuxt-link>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Icons
import iconLogo from "~/assets/img/logo.svg"

// Types
import { SocialItem } from "~/types/layout"

// Icons
import iconDiscord from "~/assets/img/icons/social/icon-discord.svg"
import iconTwitter from "~/assets/img/icons/social/icon-twitter.svg"
import iconMedium from "~/assets/img/icons/social/icon-medium.svg"
import iconTelegram from "~/assets/img/icons/social/icon-telegram.svg"

export default Vue.extend({
	name: "layout-header",
	components: {
		iconLogo
	},
	props: {
		screenWidth: Number
	},
	data() {
		return {
			social: [
				{
					text: "Discord",
					link: "https://discord.com/invite/skilllabs",
					icon: iconDiscord
				},
				{
					text: "Twitter ",
					link: "https://twitter.com/Skill_Labs_gg",
					icon: iconTwitter
				},
				{
					text: "Telegram",
					link: "https://t.me/skilllabs",
					icon: iconTelegram
				},
				{
					text: "Medium",
					link: "https://medium.com/@skilllabs",
					icon: iconMedium
				}
			] as SocialItem[]
		}
	}
})
</script>

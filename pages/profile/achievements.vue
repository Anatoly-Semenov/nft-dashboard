<template>
	<div class="profile">
		<profile-main />
		<div class="profile__content">
			<div class="profile__container">
				<ui-breadcrumb :crumbs="crumbs" />
				<p class="profile__subtitle" style="margin-top: 32px">
					My achievements
				</p>
				<profile-achievements
					v-for="(achievement, index) in achievements"
					:key="index"
					v-bind="achievement"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Components
import profileMain from "~/components/profile/profile-main.vue"
const profileAchievements = () =>
	import(
		/* webpackChunkName: "profile-achievements" */ "~/components/profile/profile-achievements.vue"
	)

// Interfaces
import { Crumb } from "~/types/ui-kit/ui-breadcrumb"

export default Vue.extend({
	name: "page-achievements",
	layout: "index",
	middleware: "auth",
	transition: "fade-in",
	components: {
		profileMain,
		profileAchievements
	},
	mounted() {
		this.$scrollTo()
	},
	data() {
		return {
			achievements: [
				{
					name: "Bomb Crypto",
					id: 1,
					logo: "https://miro.medium.com/max/640/1*E5dfZVe1b_8IxsKk-1aaww.jpeg",
					achievements: [
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-1.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-2.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-3.png"),
							earned: 10,
							points: 5,
							disabled: false
						}
					]
				},
				{
					name: "Bomb Crypto",
					id: 1,
					logo: "https://miro.medium.com/max/640/1*E5dfZVe1b_8IxsKk-1aaww.jpeg",
					achievements: [
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-1.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-2.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-3.png"),
							earned: 10,
							points: 5,
							disabled: false
						}
					]
				},
				{
					name: "Bomb Crypto",
					id: 1,
					logo: "https://miro.medium.com/max/640/1*E5dfZVe1b_8IxsKk-1aaww.jpeg",
					achievements: [
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-1.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-2.png"),
							earned: 10,
							points: 5,
							disabled: false
						},
						{
							id: 1,
							img: require("~/assets/img/temp/achievement-3.png"),
							earned: 10,
							points: 5,
							disabled: false
						}
					]
				}
			]
		}
	},
	computed: {
		crumbs(): Crumb[] {
			return [
				{
					route: "Profile",
					action: () => {
						this.$router.push("/profile")
					}
				},
				{
					route: "Achievements",
					action: () => {}
				}
			]
		}
	}
})
</script>

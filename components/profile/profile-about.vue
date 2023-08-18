<template>
	<div class="profile__about">
		<p class="profile__about-title">How it works</p>
		<div class="profile__about-list">
			<div
				class="profile__about-item"
				v-for="({ subtitle, description }, index) in list"
				:key="index"
			>
				<div class="profile__about-dot" />
				<p class="profile__about-subtitle">
					{{ subtitle }}
				</p>
				<p class="profile__about-description">
					{{ description }}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "profile-about",
	data() {
		return {
			list: [
				{
					subtitle: "Play activity",
					description:
						"Be active in games and connect your wallets to the Skill Labs platform"
				},
				{
					subtitle: "Claim achievements",
					description:
						"Get achievements for significant results in games. Personalized achievements contribute to platform points."
				},
				{
					subtitle: "Share results",
					description:
						"Share your results with friends and invite them to get their achievements"
				}
			]
		}
	}
})
</script>

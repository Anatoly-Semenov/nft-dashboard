<template>
	<div
		class="profile__referral"
		:class="{ _loading: isLoading }"
		v-if="getIsAuth"
	>
		<p class="profile__referral-title">Referral details</p>
		<p class="profile__referral-description">
			Earn great prizes by inviting friends. Referral
			<nuxt-link to="/referral">program details.</nuxt-link>
		</p>
		<div class="profile__referral-totals">
			<div
				class="profile__referral-total"
				v-for="({ title, icon, value, slug }, index) in total"
				:key="index"
			>
				<p class="profile__referral-subtitle">{{ title }}</p>
				<div class="profile__referral-row">
					<component :is="icon" />
					<p class="profile__referral-value">{{ value }}</p>
					<p class="profile__referral-slug">{{ slug }}</p>
				</div>
			</div>
		</div>
		<div class="profile__referral-main">
			<p class="profile__referral-link">{{ link }}</p>
			<button class="profile__referral-button" @click="copyReferralLink">
				<icon-copy />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Icons
const iconCopy = () =>
	import(/* webpackChunkName: "icon-copy" */ "~/assets/img/icons/icon-copy.svg")
const iconUser = () =>
	import(
		/* webpackChunkName: "icon-user-circle" */ "~/assets/img/icons/icon-user-circle.svg"
	)
const iconSkg = () =>
	import(/* webpackChunkName: "icon-skg" */ "~/assets/img/icons/icon-skg.svg")

// Types
interface Total {
	title: string
	icon: any
	value: number
	slug: string
}

export default Vue.extend({
	name: "profile-referral",
	components: {
		iconCopy
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchTotal()
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getUserId: "auth/getUserId",
			getIsAuth: "auth/getIsAuth",
			getTotal: "referral/getTotal"
		}),
		link(): string {
			return `${window.location.origin}/referral/${this.getUserId}`
		},
		total(): Total[] {
			return [
				{
					title: "You invited",
					icon: iconUser,
					value: this.getTotal?.users || 0,
					slug: `Person${this.getTotal?.users > 1 ? "s" : ""}`
				},
				{
					title: "Earned $SKG",
					icon: iconSkg,
					value: this.getTotal?.balance || 0,
					slug: "$SKG"
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchTotal: "referral/fetchTotal"
		}),
		copyReferralLink(): void {
			this.$copy(this.link)
		}
	}
})
</script>

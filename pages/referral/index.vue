<template>
	<div class="referral">
		<div class="referral__intro">
			<p class="referral__title">Referral</p>
			<p class="referral__description">
				You can earn rebates by inviting gamers to minting on Skill Labs.
				<!--		Todo: Temporary hide privacy		-->
				<nuxt-link to="/privacy" v-if="false">
					Referral program details.
				</nuxt-link>
			</p>
		</div>
		<referral-total />
		<referral-info />
		<referral-table />
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Components
import referralInfo from "~/components/referral/referral-info.vue"
import referralTotal from "~/components/referral/referral-total.vue"
import referralTable from "~/components/referral/referral-table.vue"

export default Vue.extend({
	name: "page-referral",
	layout: "index",
	transition: "fade-in",
	middleware: "auth",
	components: {
		referralInfo,
		referralTotal,
		referralTable
	},
	mounted() {
		this.$scrollTo()
		this.$amplitude.pageView("referral")
	}
})
</script>

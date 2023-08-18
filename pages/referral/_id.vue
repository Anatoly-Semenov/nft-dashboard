<template>
	<login />
</template>

<script lang="ts">
import Vue from "vue"
import { mapMutations } from "vuex"

// Pages
import login from "../login.vue"

export default Vue.extend({
	name: "referral-detail",
	layout: "index",
	transition: "fade-in",
	components: {
		login
	},
	created() {
		const referralId = +this.referralId

		if (referralId) {
			this.setReferralId(referralId)
		} else {
			this.$router.push("/login")
		}
	},
	beforeDestroy() {
		this.setReferralId(0)
	},
	computed: {
		referralId(): string {
			return this.$route.params.id
		}
	},
	methods: {
		...mapMutations({
			setReferralId: "auth/setReferralId"
		})
	}
})
</script>

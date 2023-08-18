<template>
	<div class="leaderboard__tops">
		<leaderboard-top v-for="(data, index) in tops" :key="index" :data="data" />
	</div>
</template>

<script>
import Vue from "vue"

// Components
import leaderboardTop from "./leaderboard-top.vue"

export default Vue.extend({
	name: "leaderboard-tops",
	components: {
		leaderboardTop
	},
	data() {
		return {
			tops: [{}, {}, {}]
		}
	}
})
</script>

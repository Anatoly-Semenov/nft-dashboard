<template>
	<div class="leaderboard__top"></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

export default Vue.extend({
	name: "leaderboard-top",
	props: {
		data: Object as PropType<any>
	},
	data() {
		return {}
	}
})
</script>

<template>
	<div class="game__backers" v-if="getBackers.length">
		<p class="game__backers-title">Funds and backers</p>
		<div class="game__backers-list">
			<ui-tag
				v-for="(name, index) in getBackers"
				:key="index"
				color="var(--color-background-secondary)"
			>
				{{ name }}
			</ui-tag>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

export default Vue.extend({
	name: "game-backers",
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			getBackers: "games/getBackers"
		})
	}
})
</script>

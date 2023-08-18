<template>
	<div class="index">
		<ui-spin spinning />
	</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "page-index",
	layout: "index",
	transition: "fade-in",
	mounted() {
		window.open(process.env.LANDING_PAGE_LINK, "_self")!

		this.$scrollTo()
	},
	data() {
		return {}
	}
})
</script>

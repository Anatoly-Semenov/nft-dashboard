<template>
	<div />
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "page-games",
	layout: "index",
	created() {
		this.$router.push("/")
	}
})
</script>

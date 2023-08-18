<template>
	<div />
</template>

<script>
export default {
	name: "page-profile-games",
	layout: "index",
	middleware: "auth",
	transition: "fade-in",
	created() {
		this.$router.push("/profile")
	}
}
</script>

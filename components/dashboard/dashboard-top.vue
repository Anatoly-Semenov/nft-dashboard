<template>
	<div class="dashboard__top" :class="{ _loading: isLoading }">
		<p class="dashboard__top-title">{{ title }}</p>
		<div class="dashboard__top-info">
			<ui-avatar class="dashboard__top-logo" :src="logo" />
			<div class="dashboard__top-profile">
				<p class="dashboard__top-name">{{ name }}</p>
				<p class="dashboard__top-param">{{ param }}</p>
			</div>
			<nuxt-link class="dashboard__top-link" :to="`/games/${id}`">
				Learn more
				<ui-icon type="arrow-right" />
			</nuxt-link>
		</div>
	</div>
</template>

<script>
export default {
	name: "dashboard-top",
	props: {
		title: String,
		logo: String,
		name: String,
		param: String,
		id: String,
		isLoading: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<template>
	<transition-group
		class="game__articles"
		name="slide-fade-top"
		v-if="!isUpcoming && getGameArticles.length"
	>
		<div
			class="game__articles-item"
			v-for="({ content, title, id }, index) in getGameArticles"
			:key="id + index"
		>
			<h1 class="game__articles-title" v-if="title" v-text="title" />
			<vue-markdown :breaks="false">{{ content }}</vue-markdown>
		</div>
	</transition-group>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Components
const VueMarkdown = () =>
	import(/* webpackChunkName: "vue-markdown" */ "vue-markdown")

export default Vue.extend({
	name: "game-articles",
	components: {
		VueMarkdown
	},
	props: {
		isUpcoming: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters({
			getGameArticles: "games/getGameArticles"
		})
	}
})
</script>

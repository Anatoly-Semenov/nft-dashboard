<template>
	<div class="game__social" :class="{ _loading: isLoading }">
		<transition name="fade-in">
			<a
				class="game__social-site"
				:href="site"
				target="_blank"
				v-if="isLoading || isSite"
			>
				{{ site }}
			</a>
		</transition>
		<div class="game__social-links" v-if="isLoading || isLinks">
			<ui-tooltip
				v-for="({ icon, link, text }, index) in links"
				:key="index"
				:title="text"
				placement="top"
			>
				<a class="game__social-link" :href="link" target="_blank">
					<component v-if="icon !== 'loading'" :is="icon" />
				</a>
			</ui-tooltip>
		</div>
		<div class="game__social-buttons">
			<button class="game__social-join" @click="joinInvestor">
				Join as investor
			</button>
			<button
				class="game__social-scholar"
				@click="joinScholar"
				v-if="!isLoading"
			>
				Apply for scholarships
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import gameSocialMixin from "~/mixins/game-social"
import widthMixin from "~/mixins/width"

export default mixins(gameSocialMixin, widthMixin).extend({
	name: "game-social",
	methods: {
		joinInvestor() {
			this.$toLink("https://google.com/investor")
		},
		joinScholar() {
			this.$toLink("https://google.com/scholarship")
		}
	},
	computed: {
		isMobile(): boolean {
			return this.screenWidth < 700
		},
		isSite(): boolean {
			return !!this.site && !this.isMobile
		},
		isLinks(): boolean {
			return !!this.links.length && !this.isMobile
		}
	}
})
</script>

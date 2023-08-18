<template>
	<ui-dropdown
		v-model="isDrop"
		@change="isDrop = !isDrop"
		placement="bottomRight"
	>
		<button class="game__social-mobile" slot="element">
			<icon-more />
		</button>
		<ui-menu class="game__social-mobile-list" slot="drop">
			<ui-menu-item @click="$toLink(site)">
				<icon-website />
				Website
			</ui-menu-item>
			<ui-menu-item
				v-for="({ icon, link, text }, index) in links"
				:key="index"
				@click="$toLink(link)"
			>
				<component :is="icon" />
				{{ text }}
			</ui-menu-item>
		</ui-menu>
	</ui-dropdown>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import gameSocialMixin from "~/mixins/game-social"

// Icons
import iconMore from "~/assets/img/icons/icon-more.svg"
import iconWebsite from "~/assets/img/icons/icon-website.svg"

export default mixins(gameSocialMixin).extend({
	name: "game-social-mobile",
	components: {
		iconMore,
		iconWebsite
	},
	data() {
		return {
			isDrop: false
		}
	}
})
</script>

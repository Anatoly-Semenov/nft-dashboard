<template>
	<component
		class="ui-game"
		:class="{ _loading: loading }"
		:is="clickable ? 'button' : 'div'"
		@click="onClick"
	>
		<ui-avatar :src="game.logo" :size="avatarSize" />
		<div class="ui-game__info">
			<p class="ui-game__name">{{ game.title }}</p>
			<p class="ui-game__token">{{ game.token }}</p>
		</div>
	</component>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Interfaces
interface Game {
	title: string
	logo: string
	token: string
	id: string
}

export default Vue.extend({
	name: "ui-game",
	props: {
		game: Object as PropOptions<Game>,
		clickable: {
			type: Boolean,
			default: true
		} as PropOptions<boolean>,
		avatarSize: {
			type: Number,
			default: 48
		},
		upcoming: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {}
	},
	methods: {
		onClick(): void {
			if (this.clickable && !this.loading) {
				let link: string = `/games/${this.game.id}`

				if (this.upcoming) link += "?type=upcoming"

				this.$router.push(link)
			}
		}
	}
})
</script>

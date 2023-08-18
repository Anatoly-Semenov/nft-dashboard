<template>
	<div class="game__pictures" :class="{ _loading: isLoading }">
		<button
			class="game__pictures-item"
			v-for="(item, index) in pictures"
			:key="index"
			:style="isLoading ? '' : `background-image: url(${item});`"
			@click="activeModalIndex = index + 1"
		/>

		<ui-modal
			:value="!!activeModalIndex"
			@cancel="activeModalIndex = 0"
			centered
			disableHeader
			transparentContent
			destroyOnClose
			:closable="false"
			:width="1000"
		>
			<ui-carousel>
				<img
					class="game__pictures-image"
					v-for="(item, index) in picturesCarousel"
					:key="`modal-${index} | ${item}`"
					:src="item"
				/>
			</ui-carousel>
		</ui-modal>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

export default Vue.extend({
	name: "game-pictures",
	data() {
		return {
			activeModalIndex: 0
		}
	},
	props: {
		isUpcoming: {
			type: Boolean,
			default: false
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters({
			getPictures: "games/getPictures"
		}),
		pictures(): string[] {
			return this.isLoading
				? ["1", "2", "3", "4"]
				: this.getPictures(this.isUpcoming)
		},
		picturesCarousel(): string[] {
			const pictures = this.pictures.slice()

			if (this.activeModalIndex) {
				const activePicture = pictures[this.activeModalIndex - 1]

				pictures.splice(this.activeModalIndex - 1, 1)

				pictures.unshift(activePicture)
			}

			return pictures
		}
	}
})
</script>

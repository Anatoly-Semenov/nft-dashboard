<template>
	<div class="profile-game__add">
		<p class="profile-game__add-title">Can’t find the game you want?</p>
		<p class="profile-game__add-description" v-text="description" />
		<div class="profile-game__add-fields">
			<ui-input
				:value="name"
				placeholder="Game name"
				@input="(value) => (name = value)"
			/>
			<ui-input
				:value="link"
				placeholder="Link to game"
				@input="(value) => (link = value)"
			/>
			<ui-button
				@click="submit"
				:disabled="isButtonDisabled"
				isHighlight
				:loading="isLoading"
			>
				Submit
			</ui-button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "profile-games-add",
	data() {
		return {
			description:
				"Suggest a game, and we’ll definitely look into adding it in the future. Enter the title and a link to the game or its social media profiles.",
			name: "",
			link: "",
			isLoading: false
		}
	},
	computed: {
		isButtonDisabled(): boolean {
			return !this.name || !this.link
		}
	},
	methods: {
		async submit() {
			this.isLoading = true

			await this.$feedbackApi
				.sendFeedback({
					type: "GAME_REQUEST",
					data: {
						name: this.name,
						link: this.link
					}
				})
				.then(() => {
					this.$message.success("Your order has been successfully sent")
					this.name = this.link = ""
				})
				.catch(() => {
					this.$message.error("Failed to add your game")
				})

			this.isLoading = false
		}
	}
})
</script>

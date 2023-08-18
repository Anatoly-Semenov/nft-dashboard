<template>
	<div class="error">
		<div class="error__container" v-if="error.statusCode === 404">
			<p class="error__description">This is page not found</p>
			<p class="error__title">404 ERROR</p>

			<div class="error__button">
				<error-socket class="error__socket" />
				<ui-button
					@click="$router.push('/')"
					isHighlight
					isGradient
					size="large"
				>
					Go back home
				</ui-button>
				<error-fork class="error__fork" />
			</div>
		</div>
		<div class="error__container" v-else-if="error.statusCode === 500">
			<p class="error__description">Oooops, something went wrong</p>
			<p class="error__title">500 SERVER ERROR</p>
			<p class="error__description _short">
				Try to refresh this page or reel to contact us if the problem persists
			</p>

			<div class="error__button">
				<error-socket class="error__socket" />
				<ui-button @click="reload" isHighlight isGradient size="large">
					Reload
				</ui-button>
				<error-fork class="error__fork" />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Background images
import errorSocket from "~/assets/img/error/error-socket.svg"
import errorFork from "~/assets/img/error/erorr-fork.svg"

export default Vue.extend({
	name: "error-layout",
	components: {
		errorSocket,
		errorFork
	},
	transition: "fade-in",
	props: ["error"],
	layout: "index",
	methods: {
		reload(): void {
			window.location.reload()
		}
	}
})
</script>

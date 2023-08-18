<template>
	<button class="ui-table__fullscreen" @click="isModal = true">
		<ui-icon type="fullscreen" color="var(--color-ui)" />
		Full screen

		<ui-modal
			:title="modalTitle"
			@cancel="isModal = false"
			:value="isModal"
			disableFooter
			isFullScreenOnly
			destroyOnClose
		>
			<slot />
		</ui-modal>
	</button>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
	name: "ui-table-fullscreen",
	props: {
		modalTitle: {
			type: String,
			default: "Table"
		}
	},
	data() {
		return {
			isModal: false as boolean
		}
	}
})
</script>

<template>
	<ui-modal
		class="network-modal"
		:value="value"
		:width="416"
		disableHeader
		disableFooter
		destroyOnClose
		transparent-content
		centered
		:closable="false"
		:key="isValidNetwork"
	>
		<ui-result
			title="Wrong network"
			description="Please connect to the Polygon
			 network."
			type="error"
			isSlot
		>
			<ui-button @click="changeNetwork" size="large">Change network</ui-button>
		</ui-result>
	</ui-modal>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import { networkMixin } from "~/mixins/web3"

export default mixins(networkMixin).extend({
	name: "network-modal",
	props: {
		isDisplay: Boolean
	},
	computed: {
		value(): boolean {
			return typeof this.isDisplay === "boolean"
				? this.isDisplay
				: !this.isValidNetwork
		}
	}
})
</script>

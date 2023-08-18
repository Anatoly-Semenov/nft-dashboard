<template>
	<ui-tooltip :title="title" placement="left" :key="isValidNetwork">
		<button class="ui-chain" @click="onClick">
			<transition name="fade-in">
				<img :src="networkLogo" v-if="isValidNetwork" />
				<icon-alert v-else />
			</transition>

			<network-modal :isDisplay="isModal" />
		</button>
	</ui-tooltip>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Icons
const iconAlert = () =>
	import(
		/* webpackChunkName: "icon-alert" */ "~/assets/img/icons/icon-alert.svg"
	)

// Components
const networkModal = () =>
	import(
		/* webpackChunkName: "network-modal" */ "~/components/network/network-modal.vue"
	)

// Mixins
import { networkMixin } from "~/mixins/web3"

export default mixins(networkMixin).extend({
	name: "ui-chain",
	components: {
		networkModal,
		iconAlert
	},
	data() {
		return {
			isModal: false as boolean,
			networkLogo: require("~/assets/img/polygon-logo.png")
		}
	},
	watch: {
		isValidNetwork(value: boolean) {
			if (value && this.isModal) {
				this.isModal = false
			}
		}
	},
	methods: {
		onClick(): void {
			if (!this.isValidNetwork) {
				this.isModal = true
			}
		}
	},
	computed: {
		title(): string {
			return this.isValidNetwork
				? "Your network is Polygon"
				: "Your network is not corrected. Please switch network to Polygon"
		}
	}
})
</script>

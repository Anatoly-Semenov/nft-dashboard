<template>
	<div class="ui-blockchains" :class="{ _loading: loading }">
		<template v-if="chains">
			<ui-tooltip
				v-for="({ name, img }, index) in chains"
				:key="index"
				:title="name"
				placement="top"
			>
				<div class="ui-blockchains__item">
					<img :src="img" />
				</div>
			</ui-tooltip>
		</template>
	</div>
</template>

<script lang="ts">
import Vue from "vue"

// Types
import type { Chain } from "@sk-types"

export default Vue.extend({
	name: "ui-blockchains",
	props: {
		data: String,
		loading: Boolean
	},
	computed: {
		chains(): { name: string; img: string }[] {
			if (this.loading) {
				return [0, 1, 2].map(() => require("~/assets/img/temp/chain-bsc.png"))
			}

			// @ts-ignore
			const chains: Chain[] = this.data?.split(", ") || []
			const chainsReady: { name: string; img: string }[] = []

			chains.forEach((chain: Chain) => {
				switch (chain) {
					case "BSC":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-bsc.png")
						})
						break
					case "ETH":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-eth.png")
						})
						break
					case "Polygon":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-polygon.png")
						})
						break
					case "Solana":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-solana.png")
						})
						break
					case "AVAX":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-avax.png")
						})
						break
					case "Elrond":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-elrond.png")
						})
						break
					case "Klaytin":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-klaytin.png")
						})
						break
					case "Enjin":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-enjin.png")
						})
						break
					case "Immutable-X":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-immutable.png")
						})
						break
					case "Fantom":
						chainsReady.push({
							name: chain,
							img: require("~/assets/img/temp/chain-fantom.png")
						})
						break
				}
			})

			return chainsReady
		}
	}
})
</script>

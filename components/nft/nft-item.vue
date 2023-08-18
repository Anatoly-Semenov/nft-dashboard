<template>
	<button class="nft__item" @click="toDetail">
		<span class="nft__item-count">
			<icon-lightning />
			+{{ data.scores }} up
		</span>
		<span class="nft__item-content">
			<span class="nft__item-img">
				<img :src="data.image" />
			</span>
			<span class="nft__item-name">{{ data.name }}</span>
			<span class="nft__item-description">
				{{ data.shortDescription }}
			</span>
			<ui-button @click="claim" isGradient>Claim +</ui-button>
		</span>
	</button>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Icons
import iconLightning from "~/assets/img/icons/icon-lightning.svg"

// Interfaces
import type { NftService } from "@nft-types"

export default Vue.extend({
	name: "nft-item",
	components: {
		iconLightning
	},
	props: {
		data: Object as PropOptions<NftService.Nft>
	},
	methods: {
		toDetail() {
			this.$router.push(`/nft/${this.data.id}`)
		},
		claim() {
			this.$stopEvents()
			// todo: Claim request
			console.log("Claim")
		}
	}
})
</script>

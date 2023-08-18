<template>
	<button
		class="nft__reward"
		:class="{ _loading: isLoading, _short: type === 'short' }"
		@click="onClick"
	>
		<span class="nft__reward-img" :style="imgStyles" />
		<ui-tag color="var(--color-ui)">Live</ui-tag>
		<span class="nft__reward-text" v-if="!isShort">
			<span class="nft__reward-description" v-if="data.description">
				{{ data.description }}
			</span>
			<span class="nft__reward-name" v-if="data.name">{{ data.name }}</span>
		</span>
		<ui-button v-if="!isShort" size="large" isGradient>Whitelist +</ui-button>
		<span class="nft__reward-timer">
			<icon-timer />
			{{ timer }}
		</span>
	</button>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Icons
const iconTimer = () =>
	import(
		/* webpackChunkName: "icon-timer" */ "~/assets/img/icons/icon-timer.svg"
	)

// Types
import type { AirdropService } from "@sk-types"
type type = "short" | "full"

export default Vue.extend({
	name: "nft-reward",
	components: {
		iconTimer
	},
	props: {
		data: Object as PropOptions<AirdropService.Item>,
		isLoading: Boolean as PropOptions<boolean>,
		type: {
			type: String,
			default: "full"
		} as PropOptions<type>
	},
	data() {
		return {}
	},
	computed: {
		isShort(): boolean {
			return this.type === "short"
		},
		timer(): string {
			// Todo: считать, сколько осталось времени
			return `Ends in: 2d 12h 30m`
		},
		imgStyles(): string {
			return this.isLoading || !this.data?.image
				? ""
				: `background-image: url(${this.data.image});`
		}
	},
	methods: {
		onClick(): void {
			if (!this.isShort && !this.isLoading) {
				this.$router.push(`/airdrop/${this.data.id}`)
			}
		}
	}
})
</script>

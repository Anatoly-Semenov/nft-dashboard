<template>
	<div class="crm__games" :class="{ _loading: isLoading }">
		<button
			class="crm__game"
			v-for="({ logo, title, id }, index) in games"
			:key="index"
			:class="{ _active: index === activeGameIndex, _disabled: isLoadingData }"
			:disabled="isLoadingData"
			@click="setGame(index, id)"
		>
			<span class="crm__game-img">
				<img :src="logo" />
			</span>
			<span class="crm__game-name">
				{{ title }}
			</span>
		</button>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Interfaces
import type { GameService } from "@nft-types"

export default Vue.extend({
	name: "crm-games",
	data() {
		return {
			isLoading: true as boolean,
			isLoadingData: false as boolean,
			activeGameIndex: 0 as number,
			loadingGames: [
				{
					logo: "",
					title: "loading"
				},
				{
					logo: "",
					title: "loading"
				}
			]
		}
	},
	async created(): Promise<void> {
		if (!this.getGames?.length) {
			await this.fetchGames()
			this.isLoading = false
		} else {
			this.isLoading = false
		}

		// Set active game id to store
		this.setFilter({ type: "activeGameId", value: this.games[0].id })
	},
	computed: {
		...mapGetters({
			getGames: "games/getGames"
		}),
		games(): GameService.Game[] {
			if (this.isLoading) {
				// @ts-ignore
				return this.loadingGames
			} else {
				// Todo: Add dynamic games
				// return this.getGames
				return [
					// @ts-ignore
					{
						logo: "https://public.nftstatic.com/static/nft/res/2b571967edfa4161b139a4711265a652.png",
						title: "Cyball",
						id: 2
					},
					// @ts-ignore
					{
						logo: "https://drunk-robots.com/logo-glitch.gif",
						title: "Drunk Robots",
						id: 4
					}
				]
			}
		}
	},
	methods: {
		...mapActions({
			fetchGames: "crm/fetchGames",
			setFilter: "crm/setFilter"
		}),
		async setGame(index: number, id: number): Promise<void> {
			this.activeGameIndex = index

			this.isLoadingData = true
			await this.setFilter({ type: "activeGameId", value: id })
			this.isLoadingData = false
		}
	}
})
</script>

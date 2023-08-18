<template>
	<div class="nft">
		<h1 class="nft__title">Claim Rewards for Gaming achievements!</h1>
		<h1 class="nft__subtitle">
			New items each week. Rare NFTs tied to achievements across metaverse.
			Airdrops and rewards for NFT holders.
		</h1>
		<div class="nft__items">
			<nft-item
				v-for="(nft, index) in nftList"
				:key="index"
				:data="nft"
				:class="{ _loading: isLoading }"
			/>
		</div>
		<div class="nft__rewards">
			<p class="nft__rewards-title">Rewards for NFT holders</p>
			<div class="nft__rewards-list">
				<nft-reward
					v-for="(airdrop, index) in airdropList"
					:key="index"
					:data="airdrop"
					:class="{ _loading: isLoading }"
				/>
			</div>
		</div>
		<ui-faq />
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Types
import type { AirdropService, NftService } from "@nft-types"

// Components
const nftItem = () =>
	import(/* webpackChunkName: "nft-item" */ "~/components/nft/nft-item.vue")
const nftReward = () =>
	import(/* webpackChunkName: "nft-reward" */ "~/components/nft/nft-reward.vue")

export default Vue.extend({
	name: "page-nft",
	layout: "index",
	transition: "fade-in",
	head(): { title: string } {
		return {
			title: "| NFT"
		}
	},
	components: {
		nftItem,
		nftReward
	},
	mounted() {
		this.$scrollTo()
	},
	data() {
		return {
			isLoading: false as boolean,
			rewards: [
				{
					img: "https://drunk-robots.com/social-banner.jpg",
					name: "50 Genesis robots + 5000 $METAL",
					description: "Drunk robots airdrop",
					started_at: "03.05.2022",
					finished_at: "04.05.2022"
				},
				{
					img: "https://drunk-robots.com/social-banner.jpg",
					name: "50 Genesis robots + 5000 $METAL",
					description: "Drunk robots airdrop",
					started_at: "03.05.2022",
					finished_at: "04.05.2022"
				},
				{
					img: "https://drunk-robots.com/social-banner.jpg",
					name: "50 Genesis robots + 5000 $METAL",
					description: "Drunk robots airdrop",
					started_at: "03.05.2022",
					finished_at: "04.05.2022"
				}
			]
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await Promise.all([this.fetchNftList(), this.fetchAirdropList()])
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getNftList: "nft/getNftList",
			getAirdropList: "nft/getAirdropList"
		}),
		nftList(): NftService.Nft[] {
			if (this.isLoading) {
				return this.loadingNftList
			}

			return this.getNftList
		},
		airdropList(): AirdropService.Item[] {
			return this.isLoading ? this.loadingAirdropList : this.getAirdropList
		},
		loadingNftList(): NftService.Nft[] {
			return [
				{
					chain: "loading",
					claimed: 0,
					count: 0,
					createdAt: "loading",
					description: "loading",
					expiredAt: "loading",
					id: 0,
					image: "loading",
					name: "loading",
					// @ts-ignore / Temp data
					scores: 0,
					shortDescription: "loading",
					status: "",
					updatedAt: "loading"
				},
				{
					chain: "loading",
					claimed: 0,
					count: 0,
					createdAt: "loading",
					description: "loading",
					expiredAt: "loading",
					id: 0,
					image: "loading",
					name: "loading",
					// @ts-ignore / Temp data
					scores: 0,
					shortDescription: "loading",
					status: "",
					updatedAt: "loading"
				},
				{
					chain: "loading",
					claimed: 0,
					count: 0,
					createdAt: "loading",
					description: "loading",
					expiredAt: "loading",
					id: 0,
					image: "loading",
					name: "loading",
					// @ts-ignore / Temp data
					scores: 0,
					shortDescription: "loading",
					status: "",
					updatedAt: "loading"
				},
				{
					chain: "loading",
					claimed: 0,
					count: 0,
					createdAt: "loading",
					description: "loading",
					expiredAt: "loading",
					id: 0,
					image: "loading",
					name: "loading",
					// @ts-ignore / Temp data
					scores: 0,
					shortDescription: "loading",
					status: "",
					updatedAt: "loading"
				},
				{
					chain: "loading",
					claimed: 0,
					count: 0,
					createdAt: "loading",
					description: "loading",
					expiredAt: "loading",
					id: 0,
					image: "loading",
					name: "loading",
					// @ts-ignore / Temp data
					scores: 0,
					shortDescription: "loading",
					status: "",
					updatedAt: "loading"
				}
			]
		},
		loadingAirdropList(): AirdropService.Item[] {
			return [
				{
					createdAt: "Loading",
					description: "Loading",
					id: 0,
					image: "Loading",
					name: "Loading",
					startAt: "Loading",
					status: "WHITELIST_STARTS",
					updatedAt: "Loading"
				},
				{
					createdAt: "Loading",
					description: "Loading",
					id: 1,
					image: "Loading",
					name: "Loading",
					startAt: "Loading",
					status: "WHITELIST_STARTS",
					updatedAt: "Loading"
				},
				{
					createdAt: "Loading",
					description: "Loading",
					id: 2,
					image: "Loading",
					name: "Loading",
					startAt: "Loading",
					status: "WHITELIST_STARTS",
					updatedAt: "Loading"
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchNftList: "nft/fetchNftList",
			fetchAirdropList: "nft/fetchAirdropList"
		})
	}
})
</script>

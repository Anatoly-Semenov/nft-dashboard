<template>
	<div class="airdrop" :class="{ _loading: isLoading }">
		<ui-breadcrumb :crumbs="crumbs" :isLoading="isLoading" />
		<div class="airdrop__container">
			<nft-reward :data="airdrop" type="short" :isLoading="isLoading" />
			<div class="airdrop__data">
				<div class="airdrop__data-container">
					<h1 class="airdrop__title">{{ airdrop.name }}</h1>
					<h2 class="airdrop__subtitle">{{ subtitle }}</h2>
					<p class="airdrop__description" v-if="airdrop.description">
						{{ airdrop.description }}
					</p>
					<div class="airdrop__intro">
						<p class="airdrop__intro-title">Register</p>
						<p class="airdrop__intro-subtitle">
							Follow the steps below to add yourself to the list
						</p>
					</div>
					<nft-connect />
				</div>
				<ui-faq />
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { Crumb } from "~/types/ui-kit/ui-breadcrumb"
import { mapActions, mapGetters, mapMutations } from "vuex"
import type { AirdropService } from "@nft-types"

// Components
const nftReward = () =>
	import(/* webpackChunkName: "nft-reward" */ "~/components/nft/nft-reward.vue")
const nftConnect = () =>
	import(
		/* webpackChunkName: "nft-connect" */ "~/components/nft/nft-connect.vue"
	)

export default Vue.extend({
	name: "page-airdrop-detail",
	layout: "index",
	transition: "fade-in",
	components: {
		nftReward,
		nftConnect
	},
	data() {
		return {
			isLoading: false as boolean,
			reward: {
				img: "https://drunk-robots.com/social-banner.jpg",
				started_at: "03.05.2022",
				finished_at: "04.05.2022"
			},
			status: "Live",
			image: "https://drunk-robots.com/social-banner.jpg",
			name: "Drunk Robots Airdrop",
			subtitle: "500 Genesis robots + 5000 $METAL",
			date: "Ends in: 2d 12h 30m",
			description:
				"If you’ve ever wondered whether an avocado is a fruit or a vegetable, you’ve come to the right place. To answer your question: Yes, avocados are fruits. More specifically, though, they’re berries. They also known as an alligator pear or butter fruit. No matter what you call them, avocados are incredibly"
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchAirdrop(this.id)
		this.isLoading = false
	},
	mounted() {
		this.$scrollTo()
	},
	beforeDestroy() {
		this.setAirdropDetail(null)
	},
	computed: {
		...mapGetters({
			getAirdrop: "nft/getAirdrop"
		}),
		id(): string {
			return this.$route.params.id
		},
		crumbs(): Crumb[] {
			return [
				{
					route: "NFT",
					action: () => {
						this.$router.push("/nft")
					}
				},
				{
					route: this.isLoading ? "Loading..." : "Nft name",
					action: () => {}
				}
			]
		},
		airdrop(): AirdropService.Item {
			return this.isLoading ? this.airdropLoading : this.getAirdrop
		},
		airdropLoading(): AirdropService.Item {
			return {
				createdAt: "Loading",
				description: "Loading",
				id: 0,
				image: "Loading",
				name: "Loading",
				startAt: "Loading",
				status: "WHITELIST_STARTS",
				updatedAt: "Loading"
			}
		}
	},
	methods: {
		...mapMutations({
			setAirdropDetail: "nft/setAirdropDetail"
		}),
		...mapActions({
			fetchAirdrop: "nft/fetchAirdrop"
		})
	}
})
</script>

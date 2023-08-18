<template>
	<div class="nft-detail" :class="{ _loading: isLoading }">
		<ui-breadcrumb :crumbs="crumbs" :isLoading="isLoading" />
		<div class="nft-detail__container">
			<div class="nft-detail__img">
				<transition name="fade-in">
					<img :src="image" v-if="image" />
				</transition>
			</div>
			<div class="nft-detail__data">
				<div class="nft-detail__data-container">
					<h1 class="nft-detail__title">{{ name }}</h1>
					<h1 class="nft-detail__date">{{ date }}</h1>
					<h1 class="nft-detail__subtitle">About the NFT</h1>
					<h1 class="nft-detail__description">
						{{ description }}
					</h1>
					<div class="nft-detail__info">
						<div
							class="nft-detail__info-item"
							v-for="({ title, value }, index) in info"
							:key="index"
						>
							<p class="nft-detail__info-title">{{ title }}</p>
							<p class="nft-detail__info-value">{{ value }}</p>
						</div>
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

// Components
const nftConnect = () =>
	import(
		/* webpackChunkName: "nft-connect" */ "~/components/nft/nft-connect.vue"
	)

// Interfaces
import { Crumb } from "~/types/ui-kit/ui-breadcrumb"
import { mapMutations, mapActions, mapGetters } from "vuex"
import dayjs from "dayjs"

export default Vue.extend({
	name: "nft-detail-page",
	layout: "index",
	transition: "fade-in",
	head(): { title: string } {
		return {
			title: "| NFT"
		}
	},
	components: {
		nftConnect
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async fetch() {
		this.isLoading = true
		await this.fetchNft(this.id)
		this.isLoading = false
	},
	mounted() {
		this.$scrollTo()
	},
	beforeDestroy() {
		this.setNftDetail(null)
	},
	computed: {
		...mapGetters({
			nft: "nft/getNft"
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
		image(): string {
			return this.nft?.image || ""
		},
		name(): string {
			return this.nft?.name || "Loading"
		},
		description(): string {
			return this.nft?.description || "Loading"
		},
		date(): string {
			const date: string | undefined = this.nft?.createdAt

			if (date) {
				return dayjs(this.nft?.createdAt).format("MMMM, D, YYYY")
			}

			return ""
		},
		daysLeft(): number {
			const today: string = dayjs().add(-1, "days").format()
			const expired: string = this.nft?.expiredAt

			return dayjs(expired).diff(today, "days")
		},
		info(): { title: string; value: string }[] {
			return [
				{
					title: "Claimed",
					value: `${this.nft?.claimed}/${this.$formatNumber(this.nft?.count)}`
				},
				{
					title: "Ends",
					value: `in ${this.daysLeft} days`
				},
				{
					title: "Chain",
					value: this.nft?.chain
				}
			]
		}
	},
	methods: {
		...mapMutations({
			setNftDetail: "nft/setNftDetail"
		}),
		...mapActions({
			fetchNft: "nft/fetchNft"
		})
	}
})
</script>

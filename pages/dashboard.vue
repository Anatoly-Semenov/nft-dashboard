<template>
	<div class="dashboard">
		<!-- Todo: temporary hide		-->
		<p class="dashboard__title" v-if="false">Top games</p>
		<!-- Todo: temporary hide		-->
		<div class="dashboard__tops" v-if="false">
			<dashboard-top
				v-for="(item, index) in topGames"
				:key="item.id + index"
				v-bind="item"
			/>
		</div>
		<!-- Todo: temporary hide		-->
		<div class="dashboard__info" v-if="false">
			<p class="dashboard__info-title">
				We use on-chain data to gather market insights
			</p>
			<p class="dashboard__info-subtitle">
				bla bla we use on-chain data to gather market insights. bla bla we use
				on-chain data to gather market insights. bla bla
			</p>
		</div>
		<dashboard-games />
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters, mapActions } from "vuex"

// Components
import dashboardTop from "~/components/dashboard/dashboard-top.vue"
import dashboardGames from "~/components/dashboard/dashboard-games.vue"

export default Vue.extend({
	name: "page-dashboard",
	layout: "index",
	transition: "fade-in",
	head(): { title: string } {
		return {
			title: "| Dashboard"
		}
	},
	components: {
		dashboardTop,
		dashboardGames
	},
	mounted() {
		this.$scrollTo()
		this.$amplitude.pageView("dashboard")
	},
	data() {
		return {
			isLoading: true,
			loadingTopList: [
				{
					title: "Loading",
					logo: "",
					name: "Loading",
					param: "Loading",
					id: "1",
					isLoading: true
				},
				{
					title: "Loading",
					logo: "",
					name: "Loading",
					param: "Loading",
					id: "2",
					isLoading: true
				},
				{
					title: "Loading",
					logo: "",
					name: "Loading",
					param: "Loading",
					id: "3",
					isLoading: true
				}
			],
			tempTopList: [
				{
					title: "Best payback",
					logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQowBXgxBe-dmzy_iOowIw8I095G4mo_jh5NU_itelMuwD9IfdcFDr1Z8k0bNlv1np_rUE&usqp=CAU",
					name: "Crypto Bomb",
					param: "4 month",
					id: "1"
				},
				{
					title: "Best payback",
					logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQowBXgxBe-dmzy_iOowIw8I095G4mo_jh5NU_itelMuwD9IfdcFDr1Z8k0bNlv1np_rUE&usqp=CAU",
					name: "Crypto Bomb",
					param: "4 month",
					id: "1"
				},
				{
					title: "Best payback",
					logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQowBXgxBe-dmzy_iOowIw8I095G4mo_jh5NU_itelMuwD9IfdcFDr1Z8k0bNlv1np_rUE&usqp=CAU",
					name: "Crypto Bomb",
					param: "4 month",
					id: "1"
				}
			]
		}
	},
	async fetch(): Promise<void> {
		await this.fetchTopGames()

		// Todo: hide emit request
		await setTimeout(() => {
			this.isLoading = false
		}, 1500)
	},
	computed: {
		...mapGetters({
			getTopGames: "games/getTopGames"
		}),
		topGames(): any[] {
			return this.isLoading ? this.loadingTopList : this.tempTopList
		}
	},
	methods: {
		...mapActions({
			fetchTopGames: "games/fetchTopGames"
		})
	}
})
</script>

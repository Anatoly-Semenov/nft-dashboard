<template>
	<div class="profile__game" :class="{ _loading: isLoading }">
		<div class="game__background" v-if="background">
			<div
				class="game__background-image"
				:style="`background-image: url(${background});`"
				v-if="screenWidth > 700"
			/>
			<div class="game__background-gradient" />
		</div>
		<div class="game__container">
			<transition name="fade-in-reverse">
				<profile-connect v-if="!getIsAuth" isFullscreen />
			</transition>
			<ui-breadcrumb :crumbs="crumbs" :isLoading="isLoading" />
			<game-profile :isLoading="isLoading" />
			<profile-game-achievements :gameId="id" @failNetwork="changeNetwork" />
		</div>
		<!--		<network-modal />-->
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters, mapMutations } from "vuex"

// Components
import profileGameAchievements from "~/components/profile/profile-game-achievements.vue"
// Todo: temporary hide network modal
// import networkModal from "~/components/network/network-modal.vue"
const profileConnect = () =>
	import(
		/* webpackChunkName: "profile-connect" */ "~/components/profile/profile-connect.vue"
	)

// Mixins
import widthMixin from "~/mixins/width"
import gameDetailMixin from "~/mixins/game-detail"
import { networkMixin } from "~/mixins/web3"

export default mixins(widthMixin, gameDetailMixin, networkMixin).extend({
	name: "page-profile-game",
	layout: "index",
	head(): { title: string } {
		return {
			title: `| Profile | ${this.title}`
		}
	},
	components: {
		profileGameAchievements,
		profileConnect
		// networkModal
	},
	beforeDestroy() {
		this.setGame({})
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchGame(this.id)
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth"
		})
	},
	methods: {
		...mapMutations({
			setGame: "profile/setGame"
		}),
		...mapActions({
			fetchGame: "games/fetchGame"
		})
	}
})
</script>

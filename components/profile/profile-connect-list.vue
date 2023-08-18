<template>
	<div class="profile__connect-list" v-if="typeList.length">
		<profile-connect
			v-for="type in typeList"
			:key="type"
			:type="type"
			:isFullscreen="isFullscreen"
		/>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Components
import profileConnect from "./profile-connect.vue"

export default Vue.extend({
	name: "profile-connect-list",
	components: {
		profileConnect
	},
	computed: {
		...mapGetters({
			getWalletAddress: "auth/getWalletAddress",
			getSteam: "auth/getSteam",
			getEpicGames: "auth/getEpicGames"
		}),
		typeList(): string[] {
			const result = []
			if (!this.getWalletAddress) {
				result.push("metamask")
			}

			if (!this.getEpicGames) {
				result.push("epicgames")
			}

			if (!this.getSteam) {
				result.push("steam")
			}

			return result
		},
		isFullscreen(): boolean {
			return this.typeList.length === 1
		}
	}
})
</script>

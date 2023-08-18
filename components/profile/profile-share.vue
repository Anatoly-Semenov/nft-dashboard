<template>
	<div class="profile__share" v-if="getIsAuth">
		<p class="profile__share-title">Share profile link</p>
		<div class="profile__share-main">
			<p class="profile__share-link">{{ link }}</p>
			<button class="profile__share-button" @click="copyProfileLink">
				<icon-copy />
			</button>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Icons
const iconCopy = () =>
	import(/* webpackChunkName: "icon-copy" */ "~/assets/img/icons/icon-copy.svg")

export default Vue.extend({
	name: "profile-share",
	components: {
		iconCopy
	},
	computed: {
		...mapGetters({
			getUserId: "auth/getUserId",
			getIsAuth: "auth/getIsAuth"
		}),
		link(): string {
			return `${window.location.origin}/profile/${this.getUserId}`
		}
	},
	methods: {
		copyProfileLink(): void {
			this.$copy(this.link)
		}
	}
})
</script>

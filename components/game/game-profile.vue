<template>
	<div class="game__profile" :class="{ _loading: isLoading }">
		<div class="game__profile-info">
			<ui-avatar :src="profile.logo" :size="56" v-if="!isLoading" />
			<div class="ui-avatar" v-else />
			<div class="game__profile-text">
				<p class="game__profile-name">{{ profile.title }}</p>
				<ui-blockchains v-if="chains" :data="chains" :loading="isLoading" />
			</div>
			<transition name="fade-in">
				<game-social-mobile
					v-if="!isLoading && screenWidth < 700"
					:isUpcoming="isUpcoming"
				/>
			</transition>
		</div>
		<div class="game__profile-tags" v-if="!isLoading">
			<ui-tag
				color="var(--color-background-secondary)"
				v-if="profile.playersCount"
			>
				Players: {{ $formatNumber(profile.playersCount) }}
			</ui-tag>
			<ui-tag color="var(--color-background-secondary)" v-if="profile.genre">
				Genre: {{ profile.genre }}
			</ui-tag>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapGetters } from "vuex"

// Components
import gameSocialMobile from "~/components/game/game-social-mobile.vue"

// Mixins
import widthMixin from "~/mixins/width"

// Types
import type { Chain } from "@sk-types/src/api/base"
import type { GameProfile } from "~/types"

export default mixins(widthMixin).extend({
	name: "game-profile",
	components: {
		gameSocialMobile
	},
	props: {
		isUpcoming: {
			type: Boolean,
			default: false
		},
		isLoading: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		...mapGetters({
			getGameProfile: "games/getGameProfile"
		}),
		profile(): GameProfile {
			return this.getGameProfile(this.isUpcoming)
		},
		chains(): Chain | string {
			return this.profile.chains || ""
		}
	}
})
</script>

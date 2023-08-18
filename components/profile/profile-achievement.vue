<template>
	<button
		class="profile__achievement"
		:class="selectorsState"
		@click="openAchievements"
	>
		<img
			class="profile__achievement-logo"
			v-if="!loading && logo"
			:src="logo"
		/>
		<img :src="img" class="profile__achievement-img" v-if="img" />
		<span class="profile__achievement-img" v-else />
		<div class="profile__achievement-text">
			<p class="profile__achievement-title">{{ title }}</p>

			<p class="profile__achievement-points" v-if="false">
				<icon-power />
				{{ points }}
				<span>Point{{ points.length > 1 ? "s" : "" }}</span>
			</p>

			<p
				class="profile__achievement-status"
				:class="{ _mint: isReadyToClaim }"
				v-if="type === 'private' && !isDisabled"
			>
				{{ isReadyToClaim ? "Mint" : "Minted" }}
				<icon-arrow-link v-if="isReadyToClaim" />
			</p>
		</div>

		<profile-achievement-modal
			:isOpen="isModal"
			:data="[data]"
			:type="type"
			@cancel="isModal = false"
		/>
	</button>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"

// Mixins
import { profileAchievementMixin } from "~/mixins/achievements"

// Components
const profileAchievementModal = () =>
	import(
		/* webpackChunkName: "profile-achievement-modal" */ "./profile-achievement-modal.vue"
	)

// Icons
const iconArrowLink = () =>
	import(
		/* webpackChunkName: "icon-arrow-link" */ "~/assets/img/icons/icon-arrow-up-right.svg"
	)

// Types
import type { PropType } from "vue"
import type { ProfileType } from "~/types"

export default mixins(profileAchievementMixin).extend({
	name: "profile-achievement",
	components: {
		profileAchievementModal,
		iconArrowLink
	},
	props: {
		loading: Boolean,
		type: {
			type: String as PropType<ProfileType>,
			default: "private"
		}
	},
	data() {
		return {
			isModal: false
		}
	},
	methods: {
		openAchievements(): void {
			this.isModal = true
		}
	}
})
</script>

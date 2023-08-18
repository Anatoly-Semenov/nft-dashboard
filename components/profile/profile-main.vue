<template>
	<div class="profile__main" :class="{ _loading: isLoading }" v-if="getIsAuth">
		<div class="profile__user">
			<ui-jazzicon :address="user.walletAddress" :diameter="56" />
			<div class="profile__user-text">
				<p class="profile__user-name">{{ user.walletAddress }}</p>
			</div>
			<!--		Todo: temporary hide	-->
			<div class="profile__main-buttons" v-if="false">
				<ui-button
					class="profile__main-buttons-edit"
					@click="$router.push('/profile/edit')"
					size="small"
				>
					<icon-pen />
				</ui-button>
			</div>
		</div>
		<div class="profile__social">
			<ui-connect title="Add Discord" type="discord" isConnectOnly />
			<ui-connect title="Add Twitter" type="twitter" isConnectOnly />
		</div>
		<div class="profile__points">
			<div
				class="profile__points-item"
				v-for="{ name, value, icon } in profileItems"
				:key="name"
				:class="{ _highlight: name === 'xSKG' }"
			>
				<span class="profile__points-item-name">{{ name }}</span>
				<div class="profile__points-item-value">
					<component :is="icon" />
					{{ value }}
				</div>
			</div>
		</div>
		<!--	Todo: Temporary hide block	-->
		<div class="profile__main-buttons" v-if="false">
			<ui-button isHighlight size="small">Add more wallets</ui-button>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import widthMixin from "~/mixins/width"

// Icons
import iconSkg from "~/assets/img/icons/icon-skg.svg"
import iconPower from "~/assets/img/icons/icon-power.svg"
import iconCrown from "~/assets/img/icons/icon-crown.svg"
import iconPen from "~/assets/img/icons/icon-pen.svg"

// Types
import type { ProfileService } from "@sk-types"

export default mixins(widthMixin).extend({
	name: "profile-main",
	components: {
		iconPen
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async fetch(): Promise<void> {
		if (this.getIsAuth && !this.getMe) {
			this.isLoading = true

			await this.fetchMe()

			this.isLoading = false
		}
	},
	watch: {
		getIsAuth(val) {
			if (val) {
				this.$fetch()
			}
		}
	},
	computed: {
		...mapGetters({
			user: "auth/getUser",
			getIsAuth: "auth/getIsAuth",
			getMe: "profile/getMe"
		}),
		me(): ProfileService.Me {
			if (this.isLoading) {
				return {
					balance: 0,
					points: 0,
					level: 0,
					image: "loading"
				}
			}

			return this.getMe
		},
		profileItems(): any {
			return [
				{
					name: "xSKG",
					value: this.me.balance,
					icon: iconSkg
				},
				{
					name: "Points",
					value: this.me.points,
					icon: iconPower
				},
				{
					name: "Level",
					value: this.me.level,
					icon: iconCrown
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchMe: "profile/fetchMe"
		})
	}
})
</script>

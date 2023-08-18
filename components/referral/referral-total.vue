<template>
	<client-only>
		<div class="referral__total" :class="{ _loading: isLoading }">
			<div class="referral__total-list">
				<div
					class="referral__total-item"
					v-for="({ title, icon, value, slug }, index) in items"
					:key="index"
				>
					<p class="referral__total-name">{{ title }}</p>
					<div class="referral__total-row">
						<component :is="icon" />
						<p class="referral__total-value">
							{{ value }}
						</p>
						<p class="referral__total-slug" v-if="slug">
							{{ slug }}
						</p>
					</div>
				</div>
			</div>
			<div class="referral__total-item _copy" v-if="link">
				<p class="referral__total-name">Referral Link</p>
				<div class="referral__total-link">
					<p>{{ link }}</p>
					<button class="referral__total-copy" @click="copyReferralLink">
						<icon-copy />
					</button>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from "vue"
import { mapActions, mapGetters } from "vuex"

// Icons
const iconCopy = () =>
	import(/* webpackChunkName: "icon-copy" */ "~/assets/img/icons/icon-copy.svg")
const iconUser = () =>
	import(
		/* webpackChunkName: "icon-user-circle" */ "~/assets/img/icons/icon-user-circle.svg"
	)
const iconSkg = () =>
	import(/* webpackChunkName: "icon-skg" */ "~/assets/img/icons/icon-skg.svg")
const iconNft = () =>
	import(/* webpackChunkName: "icon-nft" */ "~/assets/img/icons/icon-nft.svg")

// Types
interface Total {
	title: string
	icon: AsyncComponent
	value: number
	slug: string
}

export default Vue.extend({
	name: "referral-total",
	middleware: "auth",
	components: {
		iconCopy
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async fetch(): Promise<void> {
		this.isLoading = true
		await this.fetchTotal()
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getUserId: "auth/getUserId",
			getTotal: "referral/getTotal"
		}),
		link(): string {
			if (process.client) {
				return `${window.location.origin}/referral/${this.getUserId}`
			}

			return ""
		},
		items(): Total[] {
			return [
				{
					title: "Total Invitees",
					icon: iconUser,
					value: this.getTotal.users,
					slug: "Person"
				},
				{
					title: "Earned $SKG",
					icon: iconSkg,
					value: this.getTotal.balance,
					slug: "$SKG"
				},
				{
					title: "Earned Achievements",
					icon: iconNft,
					value: this.getTotal.achievements,
					slug: ""
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchTotal: "referral/fetchTotal"
		}),
		copyReferralLink(): void {
			this.$copy(this.link)
		}
	}
})
</script>

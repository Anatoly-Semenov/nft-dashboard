<template>
	<client-only>
		<div
			class="leaderboard__rewards"
			:class="{ _loading: isLoading }"
			v-if="isLoading || rewards.date"
		>
			<div class="leaderboard__rewards-info">
				<div class="leaderboard__rewards-intro">
					<p class="leaderboard__rewards-title">
						<icon-fire />
						Weekly rewards
					</p>
					<a
						class="leaderboard__rewards-more"
						:href="rewards.link"
						target="_blank"
					>
						Learn more
					</a>
				</div>
				<ui-tag color="var(--color-highlight)" :loading="isLoading">
					{{ rewards.date }}
				</ui-tag>
			</div>
			<div class="leaderboard__rewards-list">
				<button
					class="leaderboard__rewards-item"
					v-for="({ image, name, description, link }, index) in rewards.list"
					:key="index + name"
					@click="$toLink(link)"
				>
					<span class="leaderboard__rewards-img" v-if="isLoading" />
					<img class="leaderboard__rewards-img" v-else :src="image" />
					<span class="leaderboard__rewards-about">
						<span class="leaderboard__rewards-name">{{ name }}</span>
						<span class="leaderboard__rewards-description">
							{{ description }}
						</span>
					</span>
				</button>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

// Mocks
import { rewards as loadingData } from "~/static/mocks"

// Icons
import iconFire from "~/assets/img/icons/icon-fire.svg"

// Types
import type { RewardsService } from "@sk-types"

export default Vue.extend({
	name: "leaderboard-rewards",
	components: {
		iconFire
	},
	data() {
		return {
			isLoading: false as boolean
		}
	},
	async created() {
		this.isLoading = true
		await this.fetchRewards()
		this.isLoading = false
	},
	computed: {
		...mapGetters({
			getRewards: "leaderboard/getRewards"
		}),
		rewards(): RewardsService.Response {
			return this.isLoading ? loadingData : this.getRewards
		}
	},
	methods: {
		...mapActions({
			fetchRewards: "leaderboard/fetchRewards"
		})
	}
})
</script>

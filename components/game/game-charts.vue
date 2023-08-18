<template>
	<client-only>
		<div class="game__charts">
			<ui-tabs
				v-model="activeTab"
				@change="activeTab = $event"
				v-if="tabs.length > 1"
			>
				<a-tab-pane
					v-for="({ name, component, props }, index) in tabs"
					:key="`${index + 1}`"
					:tab="name"
				>
					<transition name="fade-in">
						<component
							:is="component"
							v-if="activeTab === `${index + 1}`"
							v-bind="props"
						/>
					</transition>
				</a-tab-pane>
			</ui-tabs>
			<template v-else-if="tabs.length === 1">
				<p class="game__charts-subtitle">
					{{ firstTab.name }}
				</p>
				<component :is="firstTab.component" v-bind="firstTab.props" />
			</template>
			<div v-else />
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue from "vue"

// Components
const gameChartsEconomic = () =>
	import(
		/* webpackChunkName: "game-charts-economic" */ "~/components/game/game-charts-economic.vue"
	)
const gameChartsSocial = () =>
	import(
		/* webpackChunkName: "game-charts-social" */ "~/components/game/game-charts-social.vue"
	)

// Types
interface Tab {
	name: string
	component: string
	props: object
}

export default Vue.extend({
	name: "game-charts",
	components: {
		gameChartsEconomic,
		gameChartsSocial
	},
	props: {
		isUpcoming: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			activeTab: "1" as string
		}
	},
	computed: {
		id(): string {
			return this.$route.params.id
		},
		tabs(): Tab[] {
			if (this.isUpcoming) {
				return [
					{
						name: "Social media stats",
						component: "game-charts-social",
						props: {
							gameId: Number(this.id)
						}
					}
				]
			} else {
				return [
					{
						name: "Ecomonic stats",
						component: "game-charts-economic",
						props: {}
					},
					{
						name: "Social media stats",
						component: "game-charts-social",
						props: {
							gameId: Number(this.id)
						}
					}
				]
			}
		},
		firstTab(): Tab {
			return this.tabs[0]
		}
	}
})
</script>

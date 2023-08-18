<template>
	<div :class="selector">
		<template v-if="title">
			<ui-tooltip :title="tooltip" v-if="tooltip" placement="topRight">
				<p class="ui-statistic__title">
					{{ isLoading ? "Loading" : title }}
					<icon-info class="ui-statistic__info" />
				</p>
			</ui-tooltip>
			<p class="ui-statistic__title" :class="{ _light: isLightTitle }" v-else>
				{{ isLoading ? "Loading" : title }}
			</p>
		</template>
		<p class="ui-statistic__data">
			<slot v-if="isSlot" />
			<span class="ui-statistic__data-text" v-else>
				{{ isLoading ? "Loading" : value || "N/A" }}
			</span>
			<ui-delta
				v-if="data"
				:value="deltaValue"
				:type="deltaValueType"
				:units="units"
			/>
		</p>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Icons
const iconInfo = () =>
	import(/* webpackChunkName: "icon-info" */ "~/assets/img/icons/icon-info.svg")

// Types
import { UiDeltaType } from "~/types/ui-kit/ui-delta"

export default Vue.extend({
	name: "ui-statistic",
	components: {
		iconInfo
	},
	props: {
		title: String,
		tooltip: String,
		data: [String, Number, Object],
		deltaValue: [String, Number],
		deltaValueType: String as PropOptions<UiDeltaType>,
		units: String,
		isLoading: {
			type: Boolean,
			default: false
		},
		isSlot: {
			type: Boolean,
			default: false
		},
		isLightTitle: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: "middle"
		} as PropOptions<"small" | "middle" | "large">
	},
	computed: {
		value(): string | number {
			if ((Number(this.data) ^ 0) === this.data) {
				return this.data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			}
			return this.data
		},
		selector(): string {
			let selector = "ui-statistic"

			if (this.isLoading) {
				selector += " _loading"
			}

			const addProp = (prop: string) => {
				if (prop) {
					selector += ` _${prop}`
				}
			}
			addProp(this.size)

			return selector
		}
	}
})
</script>

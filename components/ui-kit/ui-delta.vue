<template>
	<span
		class="ui-delta"
		:class="{ _negative: isNegativeDeltaValue, _zero: value === 0 }"
		v-if="isDisplay"
	>
		<ui-icon type="caret-up" />
		{{ convertedValue }} {{ deltaValueSymbol }}
	</span>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Types
import { UiDeltaType } from "~/types/ui-kit/ui-delta"

export default Vue.extend({
	name: "ui-delta",
	props: {
		value: [String, Number],
		type: {
			type: [String, Number],
			default: "text"
		} as PropOptions<UiDeltaType>,
		units: String,
		hideZeroValues: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		isDisplay(): boolean {
			if (this.hideZeroValues) {
				return !!this.value
			} else {
				const type = typeof this.value

				return type === "number" || type === "string"
			}
		},
		convertedValue(): number | string {
			let value = this.value

			if (typeof value === "number") {
				if (this.type === "percents") {
					return (Number(this.value) * 100).toFixed(2)
				}

				value = value.toFixed(2)
			}

			return this.value
		},
		isNegativeDeltaValue(): boolean {
			return this.value < 0
		},
		deltaValueSymbol(): string {
			switch (this.type) {
				case "percents":
					return "%"
				case "coin":
					return this.units || "$"
				default:
					return ""
			}
		}
	}
})
</script>

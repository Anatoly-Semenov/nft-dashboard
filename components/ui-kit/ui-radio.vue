<template>
	<a-radio-group
		class="ui-radio"
		:class="{
			_highlight: isHighlight,
			_loading: isLoading,
			_loadingData: isLoadingData
		}"
		:size="size"
		v-model="model"
		:button-style="buttonStyle"
	>
		<a-radio-button v-for="radio in list" :key="radio" :value="radio">
			{{ radio }}
		</a-radio-button>
	</a-radio-group>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-component
import { Radio } from "ant-design-vue"
Vue.use(Radio)

// Types
import { UiRadioButtonStyle, UiRadioSize } from "~/types/ui-kit/ui-radio"

export default Vue.extend({
	name: "ui-radio",
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		activeValue: {
			type: [String, Number]
		},
		size: {
			type: String,
			default: "small"
		} as PropOptions<UiRadioSize>,
		list: {
			type: Array
		} as PropOptions<string[]>,
		buttonStyle: {
			type: String,
			default: "solid"
		} as PropOptions<UiRadioButtonStyle>,
		isHighlight: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		isLoading: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		isLoadingData: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>
	},
	computed: {
		model: {
			get(): string | number {
				return this.activeValue
			},
			set(val: string): void {
				this.$emit("change", val)
			}
		}
	}
})
</script>

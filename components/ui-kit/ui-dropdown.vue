<template>
	<a-dropdown
		:placement="placement"
		:trigger="[`${trigger}`]"
		@visibleChange="visibleChange"
		v-model="model"
	>
		<slot name="element"></slot>
		<slot name="drop" slot="overlay"></slot>
	</a-dropdown>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-component
import { Dropdown } from "ant-design-vue"
Vue.use(Dropdown)

// Types
import {
	UiDropdownPlacement,
	UiDropdownTrigger
} from "~/types/ui-kit/ui-dropdown"

export default Vue.extend({
	name: "ui-dropdown",
	props: {
		value: Boolean as PropOptions<boolean>,
		trigger: {
			type: String,
			default: "hover"
		} as PropOptions<UiDropdownTrigger>,
		show: {
			type: Boolean
		} as PropOptions<boolean>,
		placement: {
			type: String,
			default: "bottomCenter"
		} as PropOptions<UiDropdownPlacement>
	},
	data() {
		return {
			isVisible: false as boolean
		}
	},
	watch: {
		show(newValue: boolean): void {
			this.isVisible = newValue
		}
	},
	computed: {
		model: {
			get(): boolean {
				return this.value
			},
			set(val: boolean): void {
				this.$emit("change", val)
			}
		}
	},
	methods: {
		visibleChange(event: Event): void {
			this.$emit("visibleChange", event)
		}
	}
})
</script>

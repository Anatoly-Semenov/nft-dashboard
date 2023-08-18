<template>
	<div class="ui-input" :class="`_${type}`">
		<span class="ui-input__title" v-if="title">{{ title }}</span>
		<a-input
			v-model="model"
			:placeholder="placeholder"
			:type="type"
			:maxLength="maxLength"
			:disabled="disabled"
		>
			<slot slot="prefix" name="prefix" />
		</a-input>
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use ui-component
import { Input } from "ant-design-vue"
Vue.use(Input)

// Types
type DisplayType = "default" | "thin"

export default Vue.extend({
	props: {
		value: String as PropOptions<string>,
		placeholder: {
			type: String,
			default: "Placeholder"
		} as PropOptions<string>,
		title: String as PropOptions<string>,
		type: String as PropOptions<string>,
		maxLength: Number as PropOptions<number>,
		displayType: {
			type: String,
			default: "default"
		} as PropOptions<DisplayType>,
		disabled: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		model: {
			get(): string {
				return this.value
			},
			set(val: string): void {
				this.$emit("input", val)
			}
		}
	}
})
</script>

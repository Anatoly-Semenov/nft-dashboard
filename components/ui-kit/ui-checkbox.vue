<template>
	<div
		class="ui-checkbox__block"
		@click.prevent="model = !model"
		v-if="type === 'switch'"
	>
		<a-switch
			class="ui-checkbox _switch"
			:checked="model"
			:size="size"
			:disabled="disabled"
		/>
		<slot />
	</div>
	<a-checkbox v-model="model" class="ui-checkbox" :disabled="disabled" v-else>
		<slot />
	</a-checkbox>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-design components
import { Checkbox, Switch } from "ant-design-vue"
Vue.use(Checkbox)
Vue.use(Switch)

// Types
type Size = "default" | "small"
type Type = "switch" | "checkbox"

export default Vue.extend({
	name: "ui-checkbox",
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		value: Boolean as PropOptions<boolean>,
		size: {
			type: String,
			default: "default"
		} as PropOptions<Size>,
		disabled: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		type: {
			type: String,
			default: "checkbox"
		} as PropOptions<Type>
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
	}
})
</script>

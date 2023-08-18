<template>
	<a-tabs
		:default-active-key="defaultKey"
		v-model="model"
		:size="size"
		:type="type"
		class="ui-tabs"
		@tabClick="tabClick"
	>
		<slot />
	</a-tabs>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Types
type Type = "line" | "card" | "editable-card"
type Size = "large" | "default" | "small"

export default Vue.extend({
	props: {
		value: String as PropOptions<string>,
		defaultKey: {
			type: String,
			default: "1"
		} as PropOptions<string>,
		type: {
			type: String,
			default: "line"
		} as PropOptions<Type>,
		size: {
			type: String,
			default: "default"
		} as PropOptions<Size>
	},
	computed: {
		model: {
			get(): string {
				return this.value
			},
			set(val: string): void {
				this.$emit("change", val)
			}
		}
	},
	methods: {
		tabClick(val: string) {
			this.$emit("tabClick", val)
		}
	}
})
</script>

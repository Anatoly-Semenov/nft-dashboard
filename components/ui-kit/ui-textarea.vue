<template>
	<div class="ui-textarea">
		<span class="ui-textarea__title" v-if="title">{{ title }}</span>
		<a-textarea :rows="4" v-model="model" :placeholder="placeholder" />
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

export default Vue.extend({
	props: {
		value: String as PropOptions<string>,
		placeholder: String as PropOptions<string>,
		title: String as PropOptions<string>
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

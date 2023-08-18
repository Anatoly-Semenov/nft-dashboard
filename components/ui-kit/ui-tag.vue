<template>
	<a-tag
		:class="selector"
		:color="color"
		:closable="closable"
		@close="$emit('close')"
		@click.native="$emit('click')"
		:visible="isVisible"
	>
		<slot />
	</a-tag>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-component
import { Tag } from "ant-design-vue"
Vue.use(Tag)

export default Vue.extend({
	name: "ui-tag",
	props: {
		color: String,
		closable: Boolean,
		loading: Boolean,
		isVisible: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: "m"
		} as PropOptions<"m" | "l">
	},
	computed: {
		selector(): string {
			let selector = "ui-tag"

			selector += ` _${this.size}`
			if (this.loading) selector += " _loading"

			return selector
		}
	}
})
</script>

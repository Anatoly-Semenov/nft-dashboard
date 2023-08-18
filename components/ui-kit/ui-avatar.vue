<template>
	<a-avatar
		class="ui-avatar"
		:class="{ _loading: loading }"
		:src="src"
		:size="size"
		:style="{
			minWidth: `${size}px`,
			maxWidth: `${size}px`
		}"
		:srcSet="srcSet"
		:icon="icon"
		:alt="alt"
		:loadError="loadError"
		:prefixCls="prefixCls"
		:shape="shape"
	/>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-design component
import { Avatar } from "ant-design-vue"
Vue.use(Avatar)

// Types
type Shape = "circle" | "square"
type Size = "small" | "large" | "default"

export default Vue.extend({
	name: "ui-avatar",
	props: {
		prefixCls: {
			type: String,
			default: undefined
		},
		shape: {
			type: String,
			default: "circle"
		} as PropOptions<Shape>,
		size: {
			type: [String, Number],
			default: "default"
		} as PropOptions<Size>,
		src: String,
		/** Srcset of image avatar */
		srcSet: String,
		icon: String,
		alt: String,
		loadError: Function,
		loading: {
			type: Boolean,
			default: false
		}
	}
})
</script>

<template>
	<a-tooltip
		class="ui-tooltip"
		:overlayClassName="overlaySelector"
		:placement="placement"
		:title="title"
		:trigger="trigger"
	>
		<template slot="title">
			<slot name="title" />
		</template>
		<slot />
	</a-tooltip>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Types
type Placement =
	| "top"
	| "left"
	| "right"
	| "bottom"
	| "topLeft"
	| "topRight"
	| "bottomLeft"
	| "bottomRight"
	| "leftTop"
	| "leftBottom"
	| "rightTop"
	| "rightBottom"

type Trigger = "hover" | "focus" | "click" | "contextmenu"

export default Vue.extend({
	name: "ui-tooltip",
	props: {
		placement: {
			type: String,
			default: "right"
		} as PropOptions<Placement>,
		title: String as PropOptions<string>,
		trigger: String as PropOptions<Trigger>,
		overlayClassName: String as PropOptions<string>
	},
	computed: {
		overlaySelector(): string {
			return `ui-tooltip__overlay${
				this.overlayClassName ? " " + this.overlayClassName : ""
			}`
		}
	}
})
</script>

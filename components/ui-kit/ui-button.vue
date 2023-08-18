<template>
	<a-button
		:class="getSelector"
		:type="buttonType"
		@click="$emit('click')"
		:disabled="disabled"
		:loading="loading"
	>
		<slot name="left-icon" />
		<slot name="comment-icon" />
		<slot></slot>
	</a-button>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-design component
import { Button } from "ant-design-vue"
Vue.use(Button)

// Types
import { UiButtonSize, UiButtonType } from "~/types/ui-kit/ui-button"

export default Vue.extend({
	name: "ui-button",
	props: {
		size: {
			type: String,
			default: "default"
		} as PropOptions<UiButtonSize>,
		type: {
			type: String,
			default: "primary"
		} as PropOptions<UiButtonType>,
		disabled: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		loading: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		isHighlight: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		isGradient: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		isUnauthorized: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>
	},
	computed: {
		buttonType(): UiButtonType {
			return this.type === "secondary" ? "primary" : this.type
		},
		getSelector(): string {
			let selector: string = "ui-button"

			const addProp = (prop: string): void => {
				if (prop) {
					selector += ` _${prop}`
				}
			}

			addProp(this.type)
			addProp(this.size)

			if (this.isHighlight) {
				addProp("highlight")
			}

			if (this.isGradient) {
				addProp("gradient")
			}

			if (this.isUnauthorized) {
				addProp("unauthorized")
			}

			return selector
		}
	}
})
</script>

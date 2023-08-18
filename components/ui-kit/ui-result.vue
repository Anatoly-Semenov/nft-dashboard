<template>
	<div class="ui-result" :class="`_${size} _${type}`">
		<component
			class="ui-result__icon"
			:is="icon"
			type="loading"
			color="var(--color-ui)"
		/>
		<div class="ui-result__title">
			{{ title }}
		</div>
		<div class="ui-result__description" v-if="description">
			{{ description }}
		</div>
		<div class="ui-result__slot" v-if="isSlot">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { AsyncComponent, PropType } from "vue"

// Icons
const iconInfo = () =>
	import(
		/* webpackChunkName: "icon-info" */ "~/assets/img/icons/icon-info-circle.svg"
	)
const iconErrorInfo = () =>
	import(
		/* webpackChunkName: "icon-error-info" */ "~/assets/img/icons/icon-error-info.svg"
	)
const iconMetamask = () =>
	import(
		/* webpackChunkName: "icon-metamask" */ "~/assets/img/icon-metamask.svg"
	)

// Types
import type { Type, Size } from "~/types/ui-kit/ui-result"

export default Vue.extend({
	name: "ui-result",
	props: {
		type: {
			type: String as PropType<Type>,
			default: "info"
		},
		title: String,
		description: String,
		size: {
			type: String as PropType<Size>,
			default: "m"
		},
		isSlot: Boolean
	},

	computed: {
		icon(): AsyncComponent | string {
			switch (this.type) {
				case "error":
					return iconErrorInfo
				case "metamask":
					return iconMetamask
				case "loading":
					return "ui-icon"
				default:
					return iconInfo
			}
		}
	}
})
</script>

<template>
	<a-alert
		class="ui-alert"
		:message="message"
		:description="description"
		:type="type"
		:showIcon="showIcon"
	>
		<slot name="icon" slot="icon" />
		<slot name="description" slot="description" />
	</a-alert>
</template>

<script lang="ts">
import Vue, { PropType } from "vue"

// Use Ant-design component
import { Alert } from "ant-design-vue"
Vue.use(Alert)

// Types
import { Type } from "~/types/ui-kit/ui-alert"

export default Vue.extend({
	name: "ui-alert",
	props: {
		message: String,
		description: String,
		type: {
			type: String as PropType<Type>,
			default: "info"
		},
		showIcon: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {}
	}
})
</script>

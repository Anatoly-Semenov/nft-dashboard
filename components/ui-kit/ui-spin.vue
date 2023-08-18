<template>
	<a-spin
		class="ui-spin"
		:delay="delay"
		:size="size"
		:spinning="spinning"
		:tip="tip"
		:wrapperClassName="wrapperClassName"
	>
		<template slot="indicator">
			<slot name="indicator" />
		</template>
		<slot />
	</a-spin>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-component
import { Spin } from "ant-design-vue"
Vue.use(Spin)

// Types
type Size = "small" | "default" | "large"

export default Vue.extend({
	name: "ui-spin",
	props: {
		delay: Number as PropOptions<number>,
		size: String as PropOptions<Size>,
		spinning: Boolean as PropOptions<boolean>,
		tip: String as PropOptions<string>,
		wrapperClassName: String as PropOptions<string>
	}
})
</script>

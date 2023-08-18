<template>
	<a-collapse
		class="ui-collapse"
		defaultActiveKey="1"
		:bordered="bordered"
		:accordion="accordion"
	>
		<template slot="expandIcon" slot-scope="props">
			<a-icon type="caret-right" :rotate="props.isActive ? -90 : 90" />
		</template>
		<a-collapse-panel
			v-for="({ title, description }, index) in data"
			:key="index + 1"
			:header="title"
		>
			<p>{{ description }}</p>
		</a-collapse-panel>
	</a-collapse>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use Ant-design components
import { Collapse } from "ant-design-vue"
Vue.use(Collapse)

// Interfaces
import { UiCollapseData } from "~/types/ui-kit/ui-collpase"

export default Vue.extend({
	name: "ui-collapse",
	props: {
		data: Array as PropOptions<UiCollapseData[]>,
		bordered: {
			type: Boolean,
			default: true
		} as PropOptions<boolean>,
		accordion: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>
	}
})
</script>

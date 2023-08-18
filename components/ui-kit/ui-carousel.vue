<template>
	<a-carousel class="ui-carousel" arrows>
		<div slot="prevArrow" class="ui-carousel__arrow">
			<ui-icon type="left" />
		</div>
		<div slot="nextArrow" class="ui-carousel__arrow">
			<ui-icon type="right" />
		</div>
		<slot />
		<slot name="customPaging" slot="customPaging" />
	</a-carousel>
</template>

<script lang="ts">
import Vue from "vue"

// Components
import { Carousel } from "ant-design-vue"

Vue.use(Carousel)

export default Vue.extend({
	name: "ui-carousel",
	data() {
		return {}
	}
})
</script>

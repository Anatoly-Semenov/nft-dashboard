<template>
	<div class="ui-menu-item" @click.prevent="$emit('click')">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "ui-menu-item",
	data() {
		return {}
	}
}
</script>

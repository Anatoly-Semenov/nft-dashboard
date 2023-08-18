<template>
	<button @click="isOpen = !isOpen" v-click-outside="openSelect">
		<span class="ui-select__title" v-if="!showSearch">{{ title }}</span>
		<a-select
			:size="size"
			:placeholder="placeholder"
			v-model="model"
			:open="isOpen"
			class="ui-select"
			:class="{ _input: showSearch }"
			:showSearch="showSearch"
			dropdownClassName="ui-select__dropdown"
			@search="handleSearch"
			:filter-option="filterOption"
			:not-found-content="notFoundContent"
			:default-active-first-option="defaultActiveFirstOption"
		>
			<ui-icon type="search" slot="suffixIcon" v-if="showSearch" />
			<template v-for="(item, index) in list">
				<slot :item="item" :index="index">
					<a-select-option :value="item" :key="index" class="ui-select__option">
						{{ item }}
					</a-select-option>
				</slot>
			</template>
		</a-select>
	</button>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Use ui-component
import { Select } from "ant-design-vue"
Vue.use(Select)

// Types
type Size = "default" | "large" | "small"

export default Vue.extend({
	name: "ui-select",
	model: {
		prop: "value",
		event: "change"
	},
	props: {
		value: String as PropOptions<string>,
		size: {
			type: String,
			default: "large"
		} as PropOptions<Size>,
		showSearch: {
			type: Boolean,
			default: false
		} as PropOptions<boolean>,
		placeholder: String as PropOptions<string>,
		defaultValue: String as PropOptions<string>,
		title: String as PropOptions<string>,
		list: Array as PropOptions<string[]>,
		filterOption: Boolean as PropOptions<boolean>,
		notFoundContent: String as PropOptions<string>,
		defaultActiveFirstOption: {
			type: Boolean,
			default: true
		} as PropOptions<boolean>
	},
	data() {
		return {
			isOpen: false as boolean
		}
	},
	computed: {
		model: {
			get(): string {
				return this.value
			},
			set(val: string): void {
				this.$emit("change", val)
			}
		}
	},
	methods: {
		openSelect(): void {
			this.isOpen = false
		},
		handleSearch(val: string): void {
			this.$emit("search", val)
		}
	}
})
</script>

<template>
	<div class="game__chart _table" :class="{ _loading: isLoading }">
		<p class="game__chart-title" v-if="title">
			{{ title }}
		</p>
		<transition name="fade-in">
			<a-table
				class="game__chart-table"
				:class="`_${size}`"
				:columns="columns"
				:dataSource="data"
				:pagination="false"
				:rowKey="(item) => JSON.stringify(item)"
				v-if="!isLoading"
			>
				<p
					class="game__chart-indicator"
					slot-scope="text, { class_name, color }"
					slot="class"
					v-if="class_name"
				>
					<span :style="{ backgroundColor: color }" />
					{{ class_name }}
				</p>
				<p slot-scope="price" slot="price" v-if="price">
					$ {{ Math.round(price) }}
				</p>
				<p slot-scope="number" slot="number" v-if="number">
					{{ number }}
				</p>
				<button
					class="game__chart-address"
					:class="{ _total: address === 'Total' }"
					slot-scope="address"
					slot="address"
					v-if="address"
					@click="$copy(address)"
				>
					<span>
						{{ address }}
					</span>
					<ui-icon type="copy" v-if="address !== 'Total'" />
				</button>
				<p slot-scope="amount" slot="amount" v-if="amount">
					{{ amount }}
				</p>
			</a-table>
		</transition>
		<div class="game__chart-loading" v-if="isLoading" />
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Interfaces
import { UiTableColumn } from "~/types/ui-kit/ui-table"

export default Vue.extend({
	name: "game-chart",
	props: {
		title: String as PropOptions<string>,
		columns: Array as PropOptions<UiTableColumn[]>,
		data: Array as PropOptions<any[]>,
		size: String as PropOptions<"small" | "big">,
		isLoading: Boolean as PropOptions<boolean>
	}
})
</script>

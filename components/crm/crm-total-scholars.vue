<template>
	<ui-button
		class="crm__total-scholars"
		:class="{ _unauthorized: !getIsAuth }"
		@click="onClick"
		isGradient
		:isUnauthorized="!getIsAuth"
		size="large"
	>
		{{ buttonText }}
		<ui-modal
			class="crm__total-modal"
			@cancel="isModal = false"
			@ok="onOk"
			:value="isModal"
			:width="695"
			title="Add scholars"
			okText="Add scholars"
			:disableFooter="false"
			:confirmLoading="isLoading"
		>
			<ui-textarea
				:value="scholarsData"
				placeholder="Add your scholars in csv format, e.g. wallet-1, discord-1 wallet-2, discord-2"
				@input="(value) => (scholarsData = value)"
			/>
		</ui-modal>
	</ui-button>
</template>

<script lang="ts">
import Vue from "vue"
import { mapActions, mapGetters } from "vuex"

export default Vue.extend({
	name: "crm-total-modal",
	props: {
		buttonText: {
			type: String,
			default: "Add scholars +"
		}
	},
	data() {
		return {
			isModal: false as boolean,
			isLoading: false as boolean,
			scholarsData: "" as string
		}
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth"
		})
	},
	methods: {
		...mapActions({
			addScholars: "crm/addScholars"
		}),
		async onOk() {
			this.isLoading = true
			await this.addScholars(this.scholarsData)
			this.isLoading = false

			this.isModal = false
			this.scholarsData = ""
		},
		onClick() {
			if (this.getIsAuth) this.isModal = !this.isModal
		}
	}
})
</script>

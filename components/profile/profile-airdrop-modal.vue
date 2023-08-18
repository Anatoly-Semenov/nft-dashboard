<template>
	<ui-modal
		class="profile-airdrop__modal"
		:class="`_${step}`"
		:value="isDisplay"
		:width="435"
		disableHeader
		disableFooter
		destroyOnClose
		transparent-content
		centered
		:closable="false"
		@cancel="$emit('cancel')"
	>
		<div class="profile-airdrop__modal-container">
			<component class="profile-airdrop__modal-icon" :is="activeContent.icon" />

			<transition name="fade-in">
				<p class="profile-airdrop__modal-title" :key="activeContent.title">
					{{ activeContent.title }}
				</p>
			</transition>

			<vue-markdown
				class="profile-airdrop__modal-description"
				v-if="step === 'success'"
				:breaks="false"
			>
				{{ activeContent.description }}
			</vue-markdown>
			<p class="profile-airdrop__modal-description" v-else>
				{{ activeContent.description }}
			</p>

			<ui-button
				@click="activeContent.action"
				:loading="isLoadingButton"
				:type="buttonType"
			>
				{{ activeContent.buttonText }}
			</ui-button>
		</div>
	</ui-modal>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from "vue"

// Components
const VueMarkdown = () =>
	import(/* webpackChunkName: "vue-markdown" */ "vue-markdown")

// Icons
const iconMatic = () =>
	import(
		/* webpackChunkName: "icon-matic" */ "~/assets/img/icons/icon-matic.svg"
	)
const iconSuccess = () =>
	import(
		/* webpackChunkName: "icon-success" */ "~/assets/img/icons/icon-success.svg"
	)
const iconError = () =>
	import(
		/* webpackChunkName: "icon-error" */ "~/assets/img/icons/icon-error.svg"
	)

// Types
type Step = "start" | "success" | "error"

interface Content {
	[key: string]: ContentItem
}

interface ContentItem {
	icon: AsyncComponent
	title: string
	description: string
	buttonText: string
	action: () => void
}

export default Vue.extend({
	name: "profile-airdrop-modal",
	props: {
		isDisplay: Boolean
	},
	components: {
		VueMarkdown
	},
	data() {
		return {
			step: "start" as Step,
			transactionHash: null as string | null,
			isLoadingButton: false as boolean
		}
	},
	computed: {
		txLink(): string {
			return `https://polygonscan.com/tx/${this.transactionHash}`
		},
		buttonType(): string {
			return this.step === "start" ? "primary" : "secondary"
		},
		content(): Content {
			const emitCancel = () => this.$emit("cancel")

			const sendMatic = this.sendMatic

			const getTxLink = () => this.txLink

			return {
				start: {
					icon: iconMatic,
					title: "Request MATIC",
					description:
						"Please double-check the correctness of the wallet to which will be sent 1 MATIC. If you are sure it is not the right wallet, please log in to the platform through another wallet.",
					buttonText: "Send request",
					action: sendMatic
				},
				success: {
					icon: iconSuccess,
					title: "Successfully sent",
					description: `\nYour request has been successfully completed.\n Your wallet will receive 1 MATIC within \n\n **10 minutes**. Track the transaction by following\n this link: [Txn Hash ↗](${getTxLink()}) \n\n\n If something went wrong email us <help@skillabs.io>`,
					buttonText: "Ok",
					action: emitCancel
				},
				error: {
					icon: iconError,
					title: "Today's giveaway is over",
					description:
						"Unfortunately, as of today, the limit of MATIC has expired. You can come back tomorrow for drop and get your MATIC",
					buttonText: "See you tomorrow",
					action: emitCancel
				}
			}
		},
		activeContent(): ContentItem {
			return this.content[this.step]
		}
	},
	methods: {
		async sendMatic(): Promise<void> {
			this.isLoadingButton = true

			await this.$airdropMaticApi
				.send()
				.then(({ transactionHash }) => {
					this.transactionHash = transactionHash

					window.setTimeout(() => {
						this.step = "success"
						this.$message.success("Matic successful send")
					}, 10)
				})
				.catch((error: any) => {
					this.step = "error"

					console.error(error)
				})

			this.isLoadingButton = false
		}
	}
})
</script>

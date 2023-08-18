<template>
	<div class="profile__edit">
		<div class="profile__content" style="margin-top: 0">
			<div class="profile__container">
				<ui-breadcrumb :crumbs="crumbs" />
				<p class="profile__edit-title">Settings</p>
				<div class="profile__edit-block">
					<p class="profile__edit-subtitle">Personal information</p>
					<div class="profile__edit-row">
						<ui-input
							title="First name"
							:value="firstName"
							placeholder="Enter your first name"
							@input="(value) => (firstName = value)"
						/>
						<ui-input
							title="Last name"
							:value="lastName"
							placeholder="Enter your last name"
							@input="(value) => (lastName = value)"
						/>
					</div>
					<div class="profile__edit-row">
						<ui-connect title="Connect discord" type="discord" />
						<ui-connect title="Connect twitter" type="twitter" />
					</div>
				</div>
				<!--	Todo: Temporary hide multi-wallets	-->
				<div class="profile__edit-block" v-if="false">
					<p class="profile__edit-subtitle">Wallets</p>
					<p class="profile__edit-description">
						Add a wallet to your MetaMask to authenticate your wallet. After
						that confirm it’s ownership.
					</p>
					<div class="profile__edit-wallets">
						<transition-group name="slide-fade-top-reverse">
							<div
								class="profile__edit-wallet"
								v-for="({ wallet, is_verified }, index) in wallets"
								:key="index + 1"
							>
								<div class="profile__edit-wallet-row">
									<p class="profile__edit-wallet-title">
										#{{ index + 1 }} Wallet
									</p>
									<ui-tag
										v-if="wallet === mainWallet"
										color="var(--color-background-secondary)"
									>
										Main wallet
									</ui-tag>
									<ui-tag
										:color="
											is_verified || wallet === mainWallet
												? 'var(--color-background-secondary)'
												: 'var(--color-warning)'
										"
										:class="{ _light: !(is_verified || wallet === mainWallet) }"
									>
										{{
											is_verified || wallet === mainWallet
												? "Connected"
												: "Need approval"
										}}
									</ui-tag>
								</div>
								<div class="profile__edit-wallet-row">
									<ui-input :value="wallet" disabled />
									<template v-if="wallet !== mainWallet">
										<ui-button
											v-if="is_verified"
											type="danger"
											@click="disconnect(wallet)"
											:loading="
												loadingButtonIndexes.findIndex(
													(item) => item === index
												) !== -1
											"
										>
											Disconnect
										</ui-button>
										<ui-button
											v-else
											isHighlight
											@click="approve(wallet)"
											:loading="
												loadingButtonIndexes.findIndex(
													(item) => item === index
												) !== -1
											"
										>
											Approve now
										</ui-button>
									</template>
								</div>
							</div>
						</transition-group>
					</div>
					<ui-button @click="addWallet" isHighlight>Add new wallet</ui-button>
					<profile-wallet
						:display="profileWallet.isDisplay"
						:type="profileWallet.type"
						@close="profileWallet.isDisplay = false"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapActions, mapGetters } from "vuex"

// Mixins
import walletMixin from "~/mixins/walelt"

// Types
import type { Crumb } from "~/types/ui-kit/ui-breadcrumb"
import type { UserService } from "@sk-types"

export default mixins(walletMixin).extend({
	name: "page-profile-edit",
	layout: "index",
	middleware: "auth",
	transition: "fade-in",
	data() {
		return {
			isLoading: false as boolean,
			loadingButtonIndexes: [] as number[],
			firstName: "Ivan",
			lastName: "Ivanovich",
			profileWallet: {
				type: "new",
				isDisplay: false
			}
		}
	},
	mounted() {
		this.$scrollTo()
	},
	async fetch() {
		this.isLoading = true

		await this.fetchWalletList()

		this.isLoading = false
	},
	computed: {
		...mapGetters({
			mainWallet: "auth/getWalletAddress"
		}),
		crumbs(): Crumb[] {
			return [
				{
					route: "Profile",
					action: () => {
						this.$router.push("/profile")
					}
				},
				{
					route: "Settings",
					action: () => {}
				}
			]
		}
	},
	methods: {
		...mapActions({
			fetchWalletList: "auth/fetchWalletList",
			deleteWallet: "auth/deleteWallet",
			verifyWallet: "auth/verifyWallet"
		}),
		async disconnect(wallet: string) {
			const walletIndex: number = this.wallets.findIndex(
				(item: UserService.UserWallet) => item.wallet === wallet
			)

			this.loadingButtonIndexes.push(walletIndex)

			await this.deleteWallet(wallet)

			const loadingIndex: number = this.loadingButtonIndexes.findIndex(
				(item) => item === walletIndex
			)

			this.loadingButtonIndexes.splice(loadingIndex, 1)
		},
		async approve(wallet: string) {
			const walletIndex: number = this.wallets.findIndex(
				(item: UserService.UserWallet) => item.wallet === wallet
			)

			this.loadingButtonIndexes.push(walletIndex)

			await this.verifyWallet(wallet)

			const loadingIndex: number = this.loadingButtonIndexes.findIndex(
				(item) => item === walletIndex
			)

			this.loadingButtonIndexes.splice(loadingIndex, 1)
		}
	}
})
</script>

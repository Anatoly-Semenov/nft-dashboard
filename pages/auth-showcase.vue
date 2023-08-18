<template>
	<div class="auth-showcase">
		<h1>Auth showcase</h1>

		<div class="auth-showcase__body">
			<div class="auth-showcase__block">
				<p>Auth services:</p>

				<template v-if="!user.id">
					<ui-connect title="Discord" type="discord" />
					<ui-connect title="Twitter" type="twitter" />
					<ui-connect title="Epic Games" type="epicGames" />
				</template>

				<template v-else-if="!!user.id && !user.walletAddress">
					<ui-connect
						title="Add wallet"
						:type="isSolanaAuth ? 'solana' : 'wallet'"
					/>
				</template>

				<p v-else>You are already authorized</p>
			</div>

			<div class="auth-showcase__block">
				<p>Connect social services:</p>

				<template v-if="!!user.id">
					<ui-connect title="Discord" type="discord" />
					<ui-connect title="Twitter" type="twitter" />
					<ui-connect title="Epic Games" type="epicGames" />
				</template>

				<template v-else>
					<ui-connect />
				</template>
			</div>
		</div>

		<ui-button class="auth-showcase__logout" @click="$logout()">
			Logout
		</ui-button>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

export default Vue.extend({
	name: "page-auth",
	layout: "index",
	transition: "fade-in",
	data() {
		return {}
	},
	computed: {
		...mapGetters({
			user: "auth/getUser",
			isSolanaAuth: "auth/getIsSolanaAuth"
		})
	}
})
</script>

<template>
	<div class="layout__header">
		<div class="layout__header-main">
			<button class="layout__header-logo" @click="toLanding">
				<icon-logo />
			</button>
			<transition-group
				name="fade-in"
				tag="div"
				class="layout__header-menu"
				v-if="screenWidth > 800"
			>
				<template v-for="{ text, route, action } in menu">
					<component
						class="layout__header-link"
						:key="text"
						:is="text !== 'Home' ? 'nuxt-link' : 'button'"
						:to="!!route ? route : '/'"
						@click="action"
					>
						{{ text }}
					</component>
				</template>
			</transition-group>
		</div>
		<client-only>
			<ui-connect v-if="!isAuth" />
			<div class="layout__header-connect" v-else>
				<ui-chain />
				<ui-dropdown
					v-model="isDropProfile"
					@change="isDropProfile = !isDropProfile"
					placement="bottomRight"
				>
					<button slot="element">
						<ui-connect :type="connectType" />
					</button>
					<ui-menu class="layout__header-dropdown" slot="drop">
						<ui-menu-item>
							<nuxt-link to="/profile">
								<ui-icon type="user" />
								Profile
							</nuxt-link>
						</ui-menu-item>
						<ui-menu-item>
							<button @click="$logout()">
								<ui-icon type="logout" />
								Logout
							</button>
						</ui-menu-item>
					</ui-menu>
				</ui-dropdown>
			</div>
		</client-only>
	</div>
</template>

<script lang="ts">
import Vue from "vue"
import { mapGetters } from "vuex"

// Icons
import iconLogo from "~/assets/img/logo.svg"

// Types
import { MenuItem } from "~/types/layout"
import { PropOptions } from "vue"

export default Vue.extend({
	name: "layout-header",
	components: {
		iconLogo
	},
	props: {
		menu: Array as PropOptions<MenuItem[]>,
		screenWidth: Number
	},
	data() {
		return {
			isDropProfile: false as boolean
		}
	},
	computed: {
		...mapGetters({
			isAuth: "auth/getIsAuth",
			isSolanaAuth: "auth/getIsSolanaAuth",
			isMetamaskAuth: "auth/getIsMetamaskAuth"
		}),
		connectType(): string {
			return this.isSolanaAuth && !this.isMetamaskAuth ? "solana" : "wallet"
		}
	},
	methods: {
		toLanding(): void {
			window.open(process.env.LANDING_PAGE_LINK, "_self")!
		}
	}
})
</script>

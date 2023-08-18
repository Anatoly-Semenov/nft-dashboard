<template>
	<client-only>
		<div class="login">
			<div class="login__background" v-if="screenWidth > 800">
				<img
					class="login__background-img"
					src="~/assets/img/login-background.jpg"
				/>
				<div class="login__background-gradient"></div>
			</div>
			<login-block />
		</div>
	</client-only>
</template>

<script lang="ts">
import mixins from "vue-typed-mixins"
import { mapGetters } from "vuex"

// Components
import loginBlock from "~/components/login/login-block.vue"

// Mixins
import widthMixin from "~/mixins/width"

export default mixins(widthMixin).extend({
	name: "page-login",
	layout: "index",
	middleware: "not-auth",
	components: {
		loginBlock
	},
	mounted() {
		this.$amplitude.pageView("login")
	},
	created() {
		if (this.getIsAuth) this.$router.push("/")
	},
	watch: {
		getIsAuth(value) {
			if (value) this.$router.push("/profile")
		}
	},
	computed: {
		...mapGetters({
			getIsAuth: "auth/getIsAuth"
		})
	}
})
</script>

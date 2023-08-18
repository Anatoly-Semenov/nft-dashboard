import { NuxtConfig } from "@nuxt/types"
require("dotenv").config()

const config: NuxtConfig = {
	// Target: https://go.nuxtjs.dev/config-target
	target: "server",

	// Init .ENV variables
	env: {
		BASE_API_URL: process.env.BASE_API_URL,
		ACHIEVEMENT_CONTRACT_ADDRESS:	process.env.ACHIEVEMENT_CONTRACT_ADDRESS,
		AMPLITUDE_KEY: process.env.AMPLITUDE_KEY,
		WEB3_PROVIDER: process.env.WEB3_PROVIDER,
		WEB3_PROVIDER_SOCKET:	process.env.WEB3_PROVIDER_SOCKET,
		NETWORK_VERSION: process.env.NETWORK_VERSION,
		LANDING_PAGE_LINK: process.env.LANDING_PAGE_LINK,
		FACEBOOK_PIXEL: process.env.FACEBOOK_PIXEL
	},

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: "nft service %s",
		title: "",
		htmlAttrs: {
			lang: "en"
		},
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "" },
			{ name: "format-detection", content: "telephone=no" }
		],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ["~/assets/styles/index.styl"],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		"~/plugins/ant-design",
		"~/plugins/axios",
		"~/plugins/global",
		"~/plugins/format-date",
		"~/plugins/format-number",
		"~/plugins/short-wallet",
		"~/plugins/api",
		{ src: "~/plugins/logout", ssr: false },
		{ src: "~/plugins/to-link", ssr: false },
		{ src: "~/plugins/stop-events", ssr: false },
		{ src: "~/plugins/amplitude", ssr: false },
		{ src: "~/plugins/copy", ssr: false },
		{ src: "~/plugins/scroll-to", ssr: false },
		{ src: "~/plugins/fb-pixel", ssr: false },
		{ src: "~/plugins/web3", ssr: false },
		{ src: "~/plugins/metamask", ssr: false },
		{ src: "~/plugins/phantom", ssr: false },
		{ src: "~/plugins/ui-chart", ssr: false }
	],

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		"@nuxt/typescript-build",
		"@nuxtjs/eslint-module"
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		// https://github.com/Developmint/nuxt-svg-loader#readme
		"nuxt-svg-loader",
		// https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt#readme
		"cookie-universal-nuxt",
		// https://github.com/WilliamDASILVA/nuxt-facebook-pixel-module
		"nuxt-facebook-pixel-module"
	],

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseURL: process.env.BASE_API_URL
	},

	// Facebook pixel configuration https://github.com/WilliamDASILVA/nuxt-facebook-pixel-module
	facebook: {
		pixelId: process.env.FACEBOOK_PIXEL,
		autoPageView: true,
		debug: process.env.NODE_ENV === "development"
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {}
}

export default config

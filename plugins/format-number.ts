// Types
import type { Plugin } from "@nuxt/types"
type Type = "number" | "format-number" | "percent"

declare module "vue/types/vue" {
	// this.$formatNumber inside Vue components
	interface Vue {
		$formatNumber(value: number, type?: Type): string
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$formatNumber inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$formatNumber(value: number, type?: Type): string
	}
	// nuxtContext.$formatNumber
	interface Context {
		$formatNumber(value: number, type?: Type): string
	}
}

declare module "vuex/types/index" {
	// this.$formatNumber inside Vuex stores
	interface Store<S> {
		$formatNumber(value: number, type?: Type): string
	}
}

const formatNumberPlugin: Plugin = ({ $formatNumber }, inject) => {
	const f = (x: number): number => {
		return x.toString().includes(".")
			? x.toString().split(".").pop()!.length
			: 0
	}

	const formatNumber = (value: number, type: Type = "format-number") => {
		if (typeof value === "number") {
			let formatValue: string | number =
				Math.round(Number(value.toFixed(1)) * 100) / 100

			if (type === "format-number") {
				if (formatValue >= 1000000) {
					formatValue = (formatValue / 1000000).toFixed(0)

					formatValue = `${formatValue} mln.`
				} else if (formatValue >= 1000) {
					formatValue = (formatValue / 1000).toFixed(0)
					formatValue = `${formatValue} k`
				}
			} else if (type === "percent") {
				formatValue = value ? (value * 100).toFixed(2) : 0
			}

			return formatValue
		}

		return 0
	}

	inject("formatNumber", formatNumber)
}

export default formatNumberPlugin

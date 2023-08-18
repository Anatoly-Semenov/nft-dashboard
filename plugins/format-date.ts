import { Plugin } from "@nuxt/types"
import type { Estimation } from "@sk-types"

// Dayjs
import dayjs from "dayjs"
const quarterOfYear = require("dayjs/plugin/quarterOfYear")
dayjs.extend(quarterOfYear)

interface Params {
	value: string | null
	estimation: Estimation
	hasYear: boolean
}

declare module "vue/types/vue" {
	// this.$formatDate inside Vue components
	interface Vue {
		$formatDate({ value, estimation }: Params): string
	}
}

declare module "@nuxt/types" {
	// nuxtContext.app.$formatDate inside asyncData, fetch, plugins, middleware, nuxtServerInit
	interface NuxtAppOptions {
		$formatDate({ value, estimation }: Params): string
	}
	// nuxtContext.$formatDate
	interface Context {
		$formatDate({ value, estimation }: Params): string
	}
}

declare module "vuex/types/index" {
	// this.$formatDate inside Vuex stores
	interface Store<S> {
		$formatDate({ value, estimation }: Params): string
	}
}

const formatDatePlugin: Plugin = ({ $formatDate }, inject) => {
	const formatDate = ({ value, estimation, hasYear }: Params) => {
		let formatValue: string = ""

		if (value) {
			switch (estimation) {
				case "YEAR":
					formatValue = hasYear ? `${dayjs(value).get("year")}` : "-"
					break
				case "QUARTER":
					// @ts-ignore
					formatValue = `Q${dayjs(value).quarter()} ${
						hasYear ? ", " + dayjs(value).get("year") : ""
					}`
					break
				case "MONTH":
					formatValue = `${dayjs(value).format("MMM")} ${
						hasYear ? ", " + dayjs(value).get("year") : ""
					}`
					break
				default:
					formatValue = dayjs(value).format(hasYear ? "MMM D, YYYY" : "MMM D")
					break
			}
		} else {
			formatValue = "TBA"
		}

		return formatValue
	}

	inject("formatDate", formatDate)
}

export default formatDatePlugin

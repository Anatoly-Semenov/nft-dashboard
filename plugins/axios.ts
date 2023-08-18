import HttpStatus from "http-status-codes"
import { notification } from "ant-design-vue"
import { AxiosRequestConfig } from "axios"
import qs from "qs"

// interfaces
import { Plugin } from "@nuxt/types"

const axiosPlugin: Plugin = ({ $axios, app }) => {
	$axios.onRequest((config: AxiosRequestConfig) => {
		const { method } = config

		if (method === "get") {
			// stringify GET params
			config.paramsSerializer = (params: any) => qs.stringify(params)
		}

		const accessToken = app.$cookies.get("accessToken")

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`
		}

		return config
	})

	$axios.onError((err: any) => {
		const { response = {} } = err
		const { method } = response.config || {}

		if (!response) {
			return
		}

		const { status, url }: { status: number; url: string } = response

		// process status 404 (Not found)
		if (
			(status === HttpStatus.NOT_FOUND ||
				status === HttpStatus.INTERNAL_SERVER_ERROR ||
				status === HttpStatus.NOT_IMPLEMENTED ||
				status === HttpStatus.LOCKED ||
				status === HttpStatus.METHOD_FAILURE ||
				status === HttpStatus.FORBIDDEN ||
				status === HttpStatus.UNPROCESSABLE_ENTITY) &&
			url !== "/achievements/progress/current"
		) {
			// if method is "GET" show 404 page
			if (method === "get") {
				// todo: If you need to block the application on error
				// error({ statusCode: status })

				notification.close("404")
				notification.error({
					// @ts-ignore
					message: "An error has occurred",
					// @ts-ignore
					description: "We are already solving this problem",
					key: "error",
					duration: 8
				})
			}
		}

		// Process status 400 (Bad Request)
		if (status === HttpStatus.BAD_REQUEST) {
			// Logout if cognito refresh token has expired
			if (response.message === "Refresh Token has expired") {
				app.$logout()
			}
		}

		// process status 401 (Unauthorized)
		if (status === HttpStatus.UNAUTHORIZED) {
			app.$logout()
		}
	})
}

export default axiosPlugin

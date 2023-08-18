import Vue from "vue"

export const listenPhantomEventsMixin = Vue.extend({
	mounted(): void {
		this.listenPhantomEvents()
	},
	methods: {
		listenPhantomEvents(): void {
			const provider = this.$phantom.getProvider()

			if (provider) {
				provider.on("connect", (publicKey: string) => {
					console.log(publicKey)
				})

				provider.on("accountChanged", (publicKey: string) => {
					console.log(publicKey)
				})

				// Forget user's public key once they disconnect
				provider.on("disconnect", () => {
					this.$logout()
				})
			}
		}
	}
})

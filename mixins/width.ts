import Vue from "vue"

export default Vue.extend({
	data() {
		return {
			screenWidth: 0 as number
		}
	},
	mounted(): void {
		window.addEventListener("resize", this.setWidth)
		this.setWidth()
	},
	destroyed(): void {
		window.removeEventListener("resize", this.setWidth)
	},
	methods: {
		setWidth(): void {
			this.screenWidth = window.innerWidth
		}
	}
})

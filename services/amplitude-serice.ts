import Amplitude from "amplitude-js"

export default class AmplitudeSerice {
	private instance
	private debug: boolean

	constructor(amplitudeKey: string, debug: boolean) {
		this.instance = Amplitude.getInstance()
		this.instance.init(amplitudeKey!)
		this.debug = debug
	}

	public pageView(page: string, additionalInfo = {}): AmplitudeSerice {
		return this.logEvent("page_view", { ...additionalInfo, page })
	}

	public customEvent(name: string, data: object = {}): AmplitudeSerice {
		return this.logEvent(name, data)
	}

	public setUserId(userId: string | null): AmplitudeSerice {
		if (this.debug) {
			console.log("Amplidute.setUserId: ", { userId })
		} else {
			this.instance.setUserId(userId)
		}

		return this
	}

	private logEvent(
		eventType: string,
		eventProperties?: object
	): AmplitudeSerice {
		if (this.debug) {
			console.log("Amplidute.logEvent: ", { eventType, eventProperties })
		} else {
			this.instance.logEvent(eventType, eventProperties)
		}

		return this
	}
}

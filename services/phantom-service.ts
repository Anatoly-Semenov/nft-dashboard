// Types
interface PhantomSign {
	publicKey: string
	signature: string
}

export default class PhantomService {
	private readonly provider

	constructor() {
		this.provider = this.getProvider()
	}

	public getProvider(): any {
		if ("phantom" in window) {
			const provider = window.phantom?.solana

			if (provider?.isPhantom) {
				return provider
			}

			return ""
		}

		return ""
	}

	public async connect(): Promise<string> {
		if (window.phantom) {
			const response = await window.phantom.solana.connect()

			return response.publicKey.toString() || ""
		}

		return ""
	}

	public async disconnect(): Promise<void> {
		await this.provider.request({ method: "disconnect" })
	}

	async signMessage(message: string): Promise<PhantomSign> {
		const encodedMessage = new TextEncoder().encode(message)

		return await this.provider.signMessage(encodedMessage, "utf8")
	}
}

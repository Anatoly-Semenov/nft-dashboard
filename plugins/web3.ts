import Web3 from "web3"
import { Plugin } from "@nuxt/types"
import { Contract } from "web3-eth-contract"
import { abi, contractAddress } from "~/config"

declare global {
	interface Window {
		ethereum: any
	}
}

declare module "vue/types/vue" {
	interface Vue {
		$web3: Web3
		$nftContract: Contract
		$nftContractProvide: Contract
		$nftContractSocket: Contract
	}
}

declare module "@nuxt/types" {
	interface NuxtAppOptions {
		$web3: Web3
		$nftContract: Contract
		$nftContractProvide: Contract
		$nftContractSocket: Contract
	}

	interface Context {
		$web3: Web3
		$nftContract: Contract
		$nftContractProvide: Contract
		$nftContractSocket: Contract
	}
}

declare module "vuex/types/index" {
	interface Store<S> {
		$web3: Web3
		$nftContract: Contract
		$nftContractProvide: Contract
		$nftContractSocket: Contract
	}
}

const web3Plugin: Plugin = ({ store, app }, inject) => {
	const provider: string | null = process?.env?.WEB3_PROVIDER || null
	const providerSocket: string | null =
		process?.env?.WEB3_PROVIDER_SOCKET || null

	let web3 = null
	let web3Provide = null
	let web3ProvideSocket = null

	let contract = null
	let contractProvide = null
	let contractSocket = null

	// Init web3 instance with custom http provide
	if (provider) {
		// @ts-ignore
		web3Provide = new Web3(provider, null, {})

		if (contractAddress) {
			contractProvide = new web3Provide.eth.Contract(abi, contractAddress)
		}
	}

	// Init web3 instance with custom wss provide
	if (providerSocket) {
		const web3ProvideSocketProvider = new Web3.providers.WebsocketProvider(
			providerSocket
		)

		// @ts-ignore
		web3ProvideSocket = new Web3(web3ProvideSocketProvider, null, {})

		contractSocket = new web3ProvideSocket.eth.Contract(abi, contractAddress)
	}

	if (window?.ethereum) {
		web3 = new Web3(window.ethereum)

		if (contractAddress) {
			contract = new web3.eth.Contract(abi, contractAddress)
		}
	}

	inject("web3", web3)
	inject("web3Provide", web3Provide)
	inject("nftContract", contract)
	inject("nftContractProvide", contractProvide)
	inject("nftContractSocket", contractSocket)
}

export default web3Plugin

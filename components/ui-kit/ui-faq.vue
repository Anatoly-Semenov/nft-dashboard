<template>
	<div class="ui-faq">
		<p class="ui-faq__title">{{ title }}</p>
		<ui-collapse :data="data" />
	</div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue"

// Types
import { UiFaqData } from "~/types/ui-kit/ui-faq"

export default Vue.extend({
	name: "ui-faq",
	props: {
		title: {
			type: String,
			default: "FAQ"
		} as PropOptions<string>,
		data: {
			type: Array,
			default: () =>
				[
					{
						title: "About Skill Labs",
						description:
							"Skill Labs is a company that seeks to empower gamers, guilds, and NFT owners by building tools for them. We want to bring transparency to NFT gaming and help gamers around the world to take ownership of their digital assets, including in-game items."
					},
					{
						title: "What are Skill Labs achievements?",
						description:
							"An achievement is a claimable NFT that can be only claimed if you have achieved a certain amount of progress in a specific game. Eligibility is checked and confirmed on-chain."
					},
					{
						title: "How are they helpful?",
						description:
							"We believe that achievements will help many gamers build a gamer profile by proving a strong track record in GameFi."
					},
					{
						title: "Is it free to claim achievements?",
						description:
							"Achievement NFTs are completely free — you just need to cover the gas fee."
					},
					{
						title:
							"I played different games on different wallets. What should I do?",
						description:
							"You can mint your achievements to one selected main wallet. Just enter the wallet address to mint an NFT."
					},
					{
						title: "Are these achievements transferrable?",
						description:
							"Yes, you can transfer the achievements to another wallet, but be aware that each NFT can be tracked to the wallet address associated with specific in-game achievement."
					},
					{
						title: "Can I sell them?",
						description:
							"Yes, you’re the owner of the achievement, so you can do whatever you like with it."
					},
					{
						title:
							"I played other games, but there are no achievements for them. What should I do?",
						description:
							"We’re working hard to add an achievement system to more games. We would appreciate it if you could share what specific games you’re interested in on our form here: [https://dash.skilllabs.gg/profile](https://dash.skilllabs.gg/profile) (go to the bottom of the webpage)."
					},
					{
						title:
							"What if my wallet is compromised and my achievements are stolen?",
						description:
							"Unfortunately, each achievement can only be minted once, so please carefully ensure the safety and security of your digital assets."
					},
					{
						title:
							"I'm sure that I am eligible to claim, but the system isn’t allowing me to. What should I do?",
						description:
							"Please report in Skill Labs’ official Telegram or Discord channels by tagging a support manager, and we’ll fix it."
					},
					{
						title:
							"What are the points in my profile? How do they accrue to my account?",
						description:
							"You receive points for earning achievements and for spending or claiming rewards from the games you play. The gamers with the most points receive bonus rewards from Skill Labs and partners."
					},
					{
						title: "What is the level system in my profile? How do I level up?",
						description:
							"The level is based on the number of points you have accrued. The higher your level, the more benefits you can enjoy from Skill Labs and partners."
					}
				] as PropOptions<UiFaqData>
		}
	},
	data() {
		return {}
	}
})
</script>

<template>
	<client-only>
		<div class="referral__info">
			<div class="referral__info-row">
				<div class="referral__info-col">
					<p class="referral__info-title">
						<icon-fire />
						Now you can invite people to mint achievements and get a referral
						bonus!
					</p>
					<div class="referral__info-list _big">
						<p class="referral__info-item">
							The process is simple: copy your referral link (you can find it on
							your profile page), send it to your friend, and push him/her to
							mint at least one Web3 proof-of-skill achievement. The more people
							you invite, the higher your chances of getting rewarded.
						</p>
					</div>
				</div>
				<div class="referral__info-col _short">
					<p class="referral__info-title">Referral Bonus</p>
					<div class="referral__info-list">
						<p class="referral__info-item">
							<icon-busd />
							<b>20 BUSD</b>
							for the top 5 referrals
						</p>
						<p class="referral__info-item">
							<icon-busd />
							<b>5 BUSD</b>
							for 10 random referrals
						</p>
					</div>
				</div>
			</div>
			<div class="referral__info-row">
				<div class="referral__info-col">
					<p class="referral__info-title">
						<icon-document />
						Terms and conditions
					</p>
					<div class="referral__info-list _big">
						<p class="referral__info-item">
							We’ll count people referred between November 25 00:00 UTC+0 and
							December 9 00:00 UTC+0
						</p>
						<p class="referral__info-item">
							To be in the top 5 referrals and receive 20 BUSD, you have to
							refer at least 20 people
						</p>
					</div>
				</div>
				<div class="referral__info-col">
					<p class="referral__info-title _hide">-</p>
					<div class="referral__info-list">
						<p class="referral__info-item">
							We will NOT count the achievements minted in Fortnite or CS:GO.
							(only Web3 games)
						</p>
						<p class="referral__info-item">
							As referred people, we will count only those who’ve minted at
							least one achievement (we will not count those who connect wallet
							and do not mint any achievement)
						</p>
					</div>
				</div>
			</div>
		</div>
	</client-only>
</template>

<script lang="ts">
import Vue, { AsyncComponent } from "vue"
import { mapActions, mapGetters } from "vuex"

// Icons
const iconFire = () =>
	import(/* webpackChunkName: "icon-fire" */ "~/assets/img/icons/icon-fire.svg")
const iconDocument = () =>
	import(
		/* webpackChunkName: "icon-document" */ "~/assets/img/icons/icon-document.svg"
	)
const iconBusd = () =>
	import(/* webpackChunkName: "icon-busd" */ "~/assets/img/icons/icon-busd.svg")

export default Vue.extend({
	name: "referral-total",
	middleware: "auth",
	components: {
		iconFire,
		iconDocument,
		iconBusd
	}
})
</script>

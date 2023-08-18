import { Component } from "vue"

export interface MenuItem {
	text: string
	route: string | null
	iconType?: string
	iconName?: any
	action?: () => void
}

export interface SocialItem {
	text: string
	link: string
	icon: Component
}

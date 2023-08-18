export interface Crumb {
	action(array?: [], index?: number): void
	route: string
}

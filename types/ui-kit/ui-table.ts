export interface UiTableColumn {
	title?: string
	key: string
	dataIndex?: string
	scopedSlots?: { customRender: string }
	align?: string
	slots?: { title: string }
	width?: number | boolean
	fixed?: boolean | "left" | "right"
	sorter?: boolean
}

export interface UiTableRow {
	[key: string]: any
}

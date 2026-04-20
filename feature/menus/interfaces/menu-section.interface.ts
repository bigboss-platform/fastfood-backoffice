import type { IMenuItem } from "./menu-item.interface"

export interface IMenuSection {
    id: string
    name: string
    sortOrder: number
    isActive: boolean
    items: IMenuItem[]
}

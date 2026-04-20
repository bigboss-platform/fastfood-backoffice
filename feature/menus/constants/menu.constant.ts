import type { IMenuItem } from "../interfaces/menu-item.interface"
import type { IMenuSection } from "../interfaces/menu-section.interface"

export const EMPTY_MENU_ITEM: IMenuItem = {
    id: "",
    sectionId: "",
    name: "",
    description: "",
    price: 0,
    photoUrl: "",
    isAvailable: true,
    sortOrder: 0,
}

export const EMPTY_MENU_SECTION: IMenuSection = {
    id: "",
    name: "",
    sortOrder: 0,
    isActive: true,
    items: [],
}

export const MENU_PHOTO_MAX_BYTES = 2097152
export const MENU_PHOTO_ACCEPTED_TYPES = ["image/jpeg", "image/png"]

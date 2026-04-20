"use client"

import { apiRequest } from "@/feature/shared/lib/api-client"
import type { IMenuSection } from "../interfaces/menu-section.interface"
import type { IMenuItem } from "../interfaces/menu-item.interface"
import { EMPTY_MENU_SECTION, EMPTY_MENU_ITEM } from "../constants/menu.constant"
import { BB_ADMIN_ACCESS_TOKEN_KEY } from "@/feature/auth/constants/auth.constant"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

interface ApiMenuBody {
    sections?: IMenuSection[]
}

interface ApiSectionBody {
    section?: IMenuSection
}

interface ApiItemBody {
    item?: IMenuItem
}

interface ApiPhotoBody {
    photoUrl?: string
}

export interface ICreateItemPayload {
    name: string
    description: string
    price: number
    isAvailable: boolean
}

export interface IUpdateItemPayload {
    name: string
    description: string
    price: number
    isAvailable: boolean
    sortOrder?: number
}

export async function fetchMenu(): Promise<IMenuSection[]> {
    const result = await apiRequest<ApiMenuBody>("/api/v1/backoffice/menu")
    if (!result.ok) return []
    return result.data.sections ?? []
}

export async function createSection(name: string): Promise<IMenuSection> {
    const result = await apiRequest<ApiSectionBody>("/api/v1/backoffice/menu/sections", {
        method: "POST",
        body: { name },
    })
    if (!result.ok) return EMPTY_MENU_SECTION
    return result.data.section ?? EMPTY_MENU_SECTION
}

export async function updateSection(
    id: string,
    payload: { name?: string; isActive?: boolean; sortOrder?: number }
): Promise<IMenuSection> {
    const body: Record<string, unknown> = {}
    if (payload.name !== undefined) body.name = payload.name
    if (payload.isActive !== undefined) body.is_active = payload.isActive
    if (payload.sortOrder !== undefined) body.sort_order = payload.sortOrder
    const result = await apiRequest<ApiSectionBody>(`/api/v1/backoffice/menu/sections/${id}`, {
        method: "PUT",
        body,
    })
    if (!result.ok) return EMPTY_MENU_SECTION
    return result.data.section ?? EMPTY_MENU_SECTION
}

export async function deleteSection(id: string): Promise<boolean> {
    const result = await apiRequest<unknown>(`/api/v1/backoffice/menu/sections/${id}`, {
        method: "DELETE",
    })
    return result.ok
}

export async function createItem(
    sectionId: string,
    payload: ICreateItemPayload
): Promise<IMenuItem> {
    const result = await apiRequest<ApiItemBody>(
        `/api/v1/backoffice/menu/sections/${sectionId}/items`,
        {
            method: "POST",
            body: {
                name: payload.name,
                description: payload.description,
                price: payload.price,
                is_available: payload.isAvailable,
            },
        }
    )
    if (!result.ok) return EMPTY_MENU_ITEM
    return result.data.item ?? EMPTY_MENU_ITEM
}

export async function updateItem(id: string, payload: IUpdateItemPayload): Promise<IMenuItem> {
    const body: Record<string, unknown> = {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        is_available: payload.isAvailable,
    }
    if (payload.sortOrder !== undefined) body.sort_order = payload.sortOrder
    const result = await apiRequest<ApiItemBody>(`/api/v1/backoffice/menu/items/${id}`, {
        method: "PUT",
        body,
    })
    if (!result.ok) return EMPTY_MENU_ITEM
    return result.data.item ?? EMPTY_MENU_ITEM
}

export async function deleteItem(id: string): Promise<boolean> {
    const result = await apiRequest<unknown>(`/api/v1/backoffice/menu/items/${id}`, {
        method: "DELETE",
    })
    return result.ok
}

export async function uploadItemPhoto(id: string, file: File): Promise<string> {
    const accessToken = localStorage.getItem(BB_ADMIN_ACCESS_TOKEN_KEY) ?? ""
    const formData = new FormData()
    formData.append("photo", file)
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/backoffice/menu/items/${id}/photo`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            }
        )
        if (!response.ok) return ""
        const data: ApiPhotoBody = await response.json()
        return data.photoUrl ?? ""
    } catch {
        return ""
    }
}

import { apiRequest } from "@/feature/shared/lib/api-client"

export interface ISettings {
    businessName: string
    businessAddress: string
    phoneNumber: string
    whatsappNumber: string
    description: string
    deliveryEnabled: boolean
    costPerKm: number
    maxRadiusKm: number
    latitude: number
    longitude: number
    paymentInstructions: string
    instagramUrl: string
    facebookUrl: string
    tiktokUrl: string
}

export const EMPTY_SETTINGS: ISettings = {
    businessName: "",
    businessAddress: "",
    phoneNumber: "",
    whatsappNumber: "",
    description: "",
    deliveryEnabled: false,
    costPerKm: 0,
    maxRadiusKm: 0,
    latitude: 0,
    longitude: 0,
    paymentInstructions: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
}

export interface IThemeSettings {
    colorPrimary: string
    colorPrimaryForeground: string
    colorBackground: string
    colorSurface: string
    colorTextPrimary: string
    colorTextSecondary: string
    colorBorder: string
    fontUrl: string
    fontName: string
}

export const EMPTY_THEME_SETTINGS: IThemeSettings = {
    colorPrimary: "",
    colorPrimaryForeground: "",
    colorBackground: "",
    colorSurface: "",
    colorTextPrimary: "",
    colorTextSecondary: "",
    colorBorder: "",
    fontUrl: "",
    fontName: "",
}

interface ApiSettingsBody {
    business_name?: string
    business_address?: string
    phone_number?: string
    whatsapp_number?: string
    description?: string
    delivery_enabled?: boolean
    cost_per_km?: number
    max_radius_km?: number
    latitude?: number
    longitude?: number
    payment_instructions?: string
    instagram_url?: string
    facebook_url?: string
    tiktok_url?: string
}

interface ApiThemeBody {
    color_primary?: string
    color_primary_foreground?: string
    color_background?: string
    color_surface?: string
    color_text_primary?: string
    color_text_secondary?: string
    color_border?: string
    font_url?: string
    font_name?: string
}

function mapApiToSettings(body: ApiSettingsBody): ISettings {
    return {
        businessName: body.business_name ?? "",
        businessAddress: body.business_address ?? "",
        phoneNumber: body.phone_number ?? "",
        whatsappNumber: body.whatsapp_number ?? "",
        description: body.description ?? "",
        deliveryEnabled: body.delivery_enabled ?? false,
        costPerKm: body.cost_per_km ?? 0,
        maxRadiusKm: body.max_radius_km ?? 0,
        latitude: body.latitude ?? 0,
        longitude: body.longitude ?? 0,
        paymentInstructions: body.payment_instructions ?? "",
        instagramUrl: body.instagram_url ?? "",
        facebookUrl: body.facebook_url ?? "",
        tiktokUrl: body.tiktok_url ?? "",
    }
}

function mapApiToTheme(body: ApiThemeBody): IThemeSettings {
    return {
        colorPrimary: body.color_primary ?? "",
        colorPrimaryForeground: body.color_primary_foreground ?? "",
        colorBackground: body.color_background ?? "",
        colorSurface: body.color_surface ?? "",
        colorTextPrimary: body.color_text_primary ?? "",
        colorTextSecondary: body.color_text_secondary ?? "",
        colorBorder: body.color_border ?? "",
        fontUrl: body.font_url ?? "",
        fontName: body.font_name ?? "",
    }
}

export interface ISettingsFetchResult {
    settings: ISettings
    ok: boolean
}

export interface IThemeFetchResult {
    theme: IThemeSettings
    ok: boolean
}

export async function fetchSettings(): Promise<ISettingsFetchResult> {
    const result = await apiRequest<ApiSettingsBody>("/api/v1/backoffice/settings")
    if (!result.ok) return { settings: EMPTY_SETTINGS, ok: false }
    return { settings: mapApiToSettings(result.data), ok: true }
}

export async function fetchTheme(): Promise<IThemeFetchResult> {
    const result = await apiRequest<ApiThemeBody>("/api/v1/backoffice/theme")
    if (!result.ok) return { theme: EMPTY_THEME_SETTINGS, ok: false }
    return { theme: mapApiToTheme(result.data), ok: true }
}

export async function saveBusinessInfo(
    values: Pick<ISettings, "businessName" | "businessAddress" | "phoneNumber" | "whatsappNumber" | "description">
): Promise<boolean> {
    const result = await apiRequest("/api/v1/backoffice/settings", {
        method: "PUT",
        body: {
            business_name: values.businessName,
            business_address: values.businessAddress,
            phone_number: values.phoneNumber,
            whatsapp_number: values.whatsappNumber,
            description: values.description,
        },
    })
    return result.ok
}

export async function saveDeliveryConfig(
    values: Pick<ISettings, "deliveryEnabled" | "costPerKm" | "maxRadiusKm" | "latitude" | "longitude">
): Promise<boolean> {
    const result = await apiRequest("/api/v1/backoffice/settings", {
        method: "PUT",
        body: {
            delivery_enabled: values.deliveryEnabled,
            cost_per_km: values.costPerKm,
            max_radius_km: values.maxRadiusKm,
            latitude: values.latitude,
            longitude: values.longitude,
        },
    })
    return result.ok
}

export async function savePaymentInstructions(paymentInstructions: string): Promise<boolean> {
    const result = await apiRequest("/api/v1/backoffice/settings", {
        method: "PUT",
        body: { payment_instructions: paymentInstructions },
    })
    return result.ok
}

export async function saveSocialLinks(
    values: Pick<ISettings, "instagramUrl" | "facebookUrl" | "tiktokUrl">
): Promise<boolean> {
    const result = await apiRequest("/api/v1/backoffice/settings", {
        method: "PUT",
        body: {
            instagram_url: values.instagramUrl,
            facebook_url: values.facebookUrl,
            tiktok_url: values.tiktokUrl,
        },
    })
    return result.ok
}

export async function saveTheme(theme: IThemeSettings): Promise<boolean> {
    const result = await apiRequest("/api/v1/backoffice/theme", {
        method: "PUT",
        body: {
            color_primary: theme.colorPrimary,
            color_primary_foreground: theme.colorPrimaryForeground,
            color_background: theme.colorBackground,
            color_surface: theme.colorSurface,
            color_text_primary: theme.colorTextPrimary,
            color_text_secondary: theme.colorTextSecondary,
            color_border: theme.colorBorder,
            font_url: theme.fontUrl,
            font_name: theme.fontName,
        },
    })
    return result.ok
}

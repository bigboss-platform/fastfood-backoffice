"use client"

import {
    BB_ADMIN_ACCESS_TOKEN_KEY,
    BB_ADMIN_REFRESH_TOKEN_KEY,
    BB_ADMIN_PROFILE_KEY,
    BB_ADMIN_SESSION_COOKIE,
} from "@/feature/auth/constants/auth.constant"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

function clearAuthStorage() {
    localStorage.removeItem(BB_ADMIN_ACCESS_TOKEN_KEY)
    localStorage.removeItem(BB_ADMIN_REFRESH_TOKEN_KEY)
    localStorage.removeItem(BB_ADMIN_PROFILE_KEY)
    document.cookie = `${BB_ADMIN_SESSION_COOKIE}=; path=/; max-age=0`
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = localStorage.getItem(BB_ADMIN_REFRESH_TOKEN_KEY) ?? ""
    const hasRefreshToken = Boolean(refreshToken)
    if (!hasRefreshToken) return ""
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
        if (!response.ok) return ""
        const body: { access_token?: string; refresh_token?: string } = await response.json()
        const newAccessToken = body.access_token ?? ""
        const hasNewToken = Boolean(newAccessToken)
        if (!hasNewToken) return ""
        localStorage.setItem(BB_ADMIN_ACCESS_TOKEN_KEY, newAccessToken)
        const newRefreshToken = body.refresh_token ?? ""
        const hasNewRefreshToken = Boolean(newRefreshToken)
        if (hasNewRefreshToken) {
            localStorage.setItem(BB_ADMIN_REFRESH_TOKEN_KEY, newRefreshToken)
        }
        return newAccessToken
    } catch {
        return ""
    }
}

type ApiRequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    body?: object
}

export type ApiResponse<T> = {
    data: T
    status: number
    ok: boolean
}

async function doFetch<T>(
    path: string,
    options: ApiRequestOptions,
    accessToken: string
): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
    }
    const hasBody = Boolean(options.body)
    const fetchOptions: RequestInit = {
        method: options.method ?? "GET",
        headers,
        cache: "no-store",
        ...(hasBody && { body: JSON.stringify(options.body) }),
    }
    const response = await fetch(`${API_BASE_URL}${path}`, fetchOptions)
    const status = response.status
    const isOk = response.ok
    if (!isOk) {
        return { data: {} as T, status, ok: false }
    }
    const data: T = await response.json()
    return { data, status, ok: true }
}

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
    const accessToken = localStorage.getItem(BB_ADMIN_ACCESS_TOKEN_KEY) ?? ""
    try {
        const result = await doFetch<T>(path, options, accessToken)
        const isUnauthorized = result.status === 401
        if (!isUnauthorized) return result
        const newToken = await refreshAccessToken()
        const hasNewToken = Boolean(newToken)
        if (!hasNewToken) {
            clearAuthStorage()
            window.location.replace("/login")
            return { data: {} as T, status: 401, ok: false }
        }
        return doFetch<T>(path, options, newToken)
    } catch {
        return { data: {} as T, status: 0, ok: false }
    }
}

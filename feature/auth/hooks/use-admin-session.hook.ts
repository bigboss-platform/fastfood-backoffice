"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { ITenantAdminSession } from "../interfaces/tenant-admin-session.interface"
import type { ITenantAdminProfile } from "../interfaces/tenant-admin-profile.interface"
import type { IAdminTokenPair } from "../interfaces/admin-token-pair.interface"
import { parseAdminProfile } from "../utils/parse-admin-profile.util"
import {
    BB_ADMIN_ACCESS_TOKEN_KEY,
    BB_ADMIN_REFRESH_TOKEN_KEY,
    BB_ADMIN_PROFILE_KEY,
    BB_ADMIN_SESSION_COOKIE,
    EMPTY_TENANT_ADMIN_SESSION,
    EMPTY_TENANT_ADMIN_PROFILE,
} from "../constants/auth.constant"

interface UseAdminSessionResult {
    session: ITenantAdminSession
    profile: ITenantAdminProfile
    isAuthenticated: boolean
    login: (tokenPair: IAdminTokenPair, profile: ITenantAdminProfile) => void
    logout: () => void
}

function setSessionCookie() {
    document.cookie = `${BB_ADMIN_SESSION_COOKIE}=1; path=/; max-age=604800; samesite=lax`
}

function clearSessionCookie() {
    document.cookie = `${BB_ADMIN_SESSION_COOKIE}=; path=/; max-age=0`
}

export function useAdminSession(): UseAdminSessionResult {
    const [session, setSession] = useState<ITenantAdminSession>(EMPTY_TENANT_ADMIN_SESSION)
    const [profile, setProfile] = useState<ITenantAdminProfile>(EMPTY_TENANT_ADMIN_PROFILE)
    const router = useRouter()

    useEffect(() => {
        const accessToken = localStorage.getItem(BB_ADMIN_ACCESS_TOKEN_KEY) ?? ""
        const hasToken = Boolean(accessToken)
        if (!hasToken) return
        const refreshToken = localStorage.getItem(BB_ADMIN_REFRESH_TOKEN_KEY) ?? ""
        const profileJson = localStorage.getItem(BB_ADMIN_PROFILE_KEY) ?? ""
        const hasProfileJson = Boolean(profileJson)
        const storedProfile = hasProfileJson
            ? parseAdminProfile(profileJson)
            : EMPTY_TENANT_ADMIN_PROFILE
        setSession({
            accessToken,
            refreshToken,
            tenantAdminId: storedProfile.id,
            tenantId: storedProfile.tenantId,
            role: storedProfile.role,
            isAuthenticated: true,
        })
        setProfile(storedProfile)
        setSessionCookie()
    }, [])

    const login = useCallback((tokenPair: IAdminTokenPair, adminProfile: ITenantAdminProfile) => {
        localStorage.setItem(BB_ADMIN_ACCESS_TOKEN_KEY, tokenPair.accessToken)
        localStorage.setItem(BB_ADMIN_REFRESH_TOKEN_KEY, tokenPair.refreshToken)
        localStorage.setItem(BB_ADMIN_PROFILE_KEY, JSON.stringify(adminProfile))
        setSessionCookie()
        setSession({
            accessToken: tokenPair.accessToken,
            refreshToken: tokenPair.refreshToken,
            tenantAdminId: adminProfile.id,
            tenantId: adminProfile.tenantId,
            role: adminProfile.role,
            isAuthenticated: true,
        })
        setProfile(adminProfile)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(BB_ADMIN_ACCESS_TOKEN_KEY)
        localStorage.removeItem(BB_ADMIN_REFRESH_TOKEN_KEY)
        localStorage.removeItem(BB_ADMIN_PROFILE_KEY)
        clearSessionCookie()
        setSession(EMPTY_TENANT_ADMIN_SESSION)
        setProfile(EMPTY_TENANT_ADMIN_PROFILE)
        router.replace("/login")
    }, [router])

    const isAuthenticated = session.isAuthenticated

    return { session, profile, isAuthenticated, login, logout }
}

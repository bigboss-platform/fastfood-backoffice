"use server"

import type { ILoginResult } from "../interfaces/login-result.interface"
import type { ITenantAdminProfile } from "../interfaces/tenant-admin-profile.interface"
import { LoginErrorCode } from "../enums/login-error-code.enum"
import { EMPTY_LOGIN_RESULT } from "../constants/auth.constant"

function toLoginErrorCode(code: string): LoginErrorCode {
    if (code === "wrong_credentials") return LoginErrorCode.WRONG_CREDENTIALS
    if (code === "inactive_account") return LoginErrorCode.INACTIVE_ACCOUNT
    return LoginErrorCode.UNKNOWN
}

export async function loginWithCredentials(
    email: string,
    password: string
): Promise<ILoginResult> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/backoffice/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                cache: "no-store",
            }
        )
        if (!response.ok) {
            const errorBody: { error_code?: string } = await response.json().catch(() => ({}))
            const errorCode = toLoginErrorCode(errorBody.error_code ?? "")
            return { ...EMPTY_LOGIN_RESULT, errorCode }
        }
        const body: {
            access_token?: string
            refresh_token?: string
            user?: {
                id?: string
                name?: string
                email?: string
                role?: string
                tenant_id?: string
            }
        } = await response.json()
        const accessToken = body.access_token ?? ""
        const hasAccessToken = Boolean(accessToken)
        if (!hasAccessToken) return EMPTY_LOGIN_RESULT
        const profile: ITenantAdminProfile = {
            id: body.user?.id ?? "",
            name: body.user?.name ?? "",
            email: body.user?.email ?? "",
            role: body.user?.role ?? "",
            tenantId: body.user?.tenant_id ?? "",
        }
        return {
            tokenPair: { accessToken, refreshToken: body.refresh_token ?? "" },
            profile,
            errorCode: LoginErrorCode.NONE,
        }
    } catch {
        return EMPTY_LOGIN_RESULT
    }
}

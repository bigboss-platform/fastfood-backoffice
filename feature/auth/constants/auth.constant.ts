import type { ITenantAdminSession } from "../interfaces/tenant-admin-session.interface"
import type { ITenantAdminProfile } from "../interfaces/tenant-admin-profile.interface"
import type { IAdminTokenPair } from "../interfaces/admin-token-pair.interface"
import type { ILoginResult } from "../interfaces/login-result.interface"
import { LoginErrorCode } from "../enums/login-error-code.enum"

export const BB_ADMIN_ACCESS_TOKEN_KEY = "bb_admin_access_token"
export const BB_ADMIN_REFRESH_TOKEN_KEY = "bb_admin_refresh_token"
export const BB_ADMIN_PROFILE_KEY = "bb_admin_profile"
export const BB_ADMIN_SESSION_COOKIE = "bb_admin_session"

export const EMPTY_TENANT_ADMIN_SESSION: ITenantAdminSession = {
    accessToken: "",
    refreshToken: "",
    tenantAdminId: "",
    tenantId: "",
    role: "",
    isAuthenticated: false,
}

export const EMPTY_TENANT_ADMIN_PROFILE: ITenantAdminProfile = {
    id: "",
    name: "",
    email: "",
    role: "",
    tenantId: "",
}

export const EMPTY_ADMIN_TOKEN_PAIR: IAdminTokenPair = {
    accessToken: "",
    refreshToken: "",
}

export const EMPTY_LOGIN_RESULT: ILoginResult = {
    tokenPair: EMPTY_ADMIN_TOKEN_PAIR,
    profile: EMPTY_TENANT_ADMIN_PROFILE,
    errorCode: LoginErrorCode.UNKNOWN,
}

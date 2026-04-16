import type { ITenantAdminSession } from "../interfaces/tenant-admin-session.interface"

export const EMPTY_TENANT_ADMIN_SESSION: ITenantAdminSession = {
    accessToken: "",
    refreshToken: "",
    tenantAdminId: "",
    tenantId: "",
    role: "",
    isAuthenticated: false,
}

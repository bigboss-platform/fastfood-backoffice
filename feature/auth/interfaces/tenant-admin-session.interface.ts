export interface ITenantAdminSession {
    accessToken: string
    refreshToken: string
    tenantAdminId: string
    tenantId: string
    role: string
    isAuthenticated: boolean
}

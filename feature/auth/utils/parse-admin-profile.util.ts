import type { ITenantAdminProfile } from "../interfaces/tenant-admin-profile.interface"
import { EMPTY_TENANT_ADMIN_PROFILE } from "../constants/auth.constant"

export function parseAdminProfile(json: string): ITenantAdminProfile {
    try {
        return JSON.parse(json) as ITenantAdminProfile
    } catch {
        return EMPTY_TENANT_ADMIN_PROFILE
    }
}

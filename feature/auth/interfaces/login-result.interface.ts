import type { IAdminTokenPair } from "./admin-token-pair.interface"
import type { ITenantAdminProfile } from "./tenant-admin-profile.interface"
import type { LoginErrorCode } from "../enums/login-error-code.enum"

export interface ILoginResult {
    tokenPair: IAdminTokenPair
    profile: ITenantAdminProfile
    errorCode: LoginErrorCode
}

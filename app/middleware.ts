import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DASHBOARD_PATHS = [
    "/dashboard",
    "/orders",
    "/chef",
    "/menus",
    "/analytics",
    "/settings",
]

function isDashboardPath(pathname: string): boolean {
    return DASHBOARD_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionCookie = request.cookies.get("bb_admin_session")
    const isLoggedIn = Boolean(sessionCookie?.value)
    const isLoginPage = pathname === "/login"
    const isDashboard = isDashboardPath(pathname)

    if (isLoggedIn && isLoginPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (!isLoggedIn && isDashboard) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|api).*)"],
}

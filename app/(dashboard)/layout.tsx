"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAdminSession } from "@/feature/auth/hooks/use-admin-session.hook"
import { DashboardLayout } from "@/feature/shared/components/dashboard-layout.component"

interface DashboardRouteLayoutProps {
    children: React.ReactNode
}

export default function DashboardRouteLayout({ children }: DashboardRouteLayoutProps) {
    const { isAuthenticated } = useAdminSession()
    const router = useRouter()

    useEffect(() => {
        const shouldRedirect = !isAuthenticated
        if (shouldRedirect) {
            router.replace("/login")
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return <></>
    }

    return <DashboardLayout>{children}</DashboardLayout>
}

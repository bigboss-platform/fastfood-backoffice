import { DashboardLayout } from "@/feature/shared/components/dashboard-layout.component"

interface DashboardRouteLayoutProps {
    children: React.ReactNode
}

export default function DashboardRouteLayout({ children }: DashboardRouteLayoutProps) {
    return <DashboardLayout>{children}</DashboardLayout>
}

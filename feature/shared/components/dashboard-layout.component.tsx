"use client"

import styles from "../styles/dashboard-layout.style.module.css"
import { Sidebar } from "./sidebar.component"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className={styles.dashboardLayout}>
            <Sidebar />
            <main className={styles.dashboardLayoutMain}>{children}</main>
        </div>
    )
}

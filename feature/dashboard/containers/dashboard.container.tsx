"use client"

import { useState } from "react"
import styles from "../styles/dashboard.style.module.css"

interface IDashboardStats {
    ordersToday: number
    revenueToday: number
    activeOrders: number
    pendingPayments: number
}

const EMPTY_DASHBOARD_STATS: IDashboardStats = {
    ordersToday: 0,
    revenueToday: 0,
    activeOrders: 0,
    pendingPayments: 0,
}

export function DashboardContainer() {
    const [stats] = useState<IDashboardStats>(EMPTY_DASHBOARD_STATS)

    return (
        <section className={styles.dashboard}>
            <h2 className={styles.dashboardTitle}>Dashboard</h2>
            <ul className={styles.dashboardStats} aria-label="Métricas del día">
                <li className={styles.dashboardStatCard}>
                    <span className={styles.dashboardStatValue}>{stats.ordersToday}</span>
                    <span className={styles.dashboardStatLabel}>Pedidos hoy</span>
                </li>
                <li className={styles.dashboardStatCard}>
                    <span className={styles.dashboardStatValue}>
                        ${stats.revenueToday.toFixed(2)}
                    </span>
                    <span className={styles.dashboardStatLabel}>Ingresos hoy</span>
                </li>
                <li className={styles.dashboardStatCard}>
                    <span className={styles.dashboardStatValue}>{stats.activeOrders}</span>
                    <span className={styles.dashboardStatLabel}>Pedidos activos</span>
                </li>
                <li className={styles.dashboardStatCard}>
                    <span className={styles.dashboardStatValue}>{stats.pendingPayments}</span>
                    <span className={styles.dashboardStatLabel}>Pagos pendientes</span>
                </li>
            </ul>
        </section>
    )
}

"use client"

import { useState, useEffect } from "react"
import { StatCard } from "../components/stat-card.component"
import {
    fetchDashboardStats,
    EMPTY_DASHBOARD_STATS,
} from "../services/dashboard.service"
import type { IDashboardStats } from "../services/dashboard.service"
import styles from "../styles/dashboard.style.module.css"

const DASHBOARD_POLL_INTERVAL_MS = 60000

export function DashboardContainer() {
    const [stats, setStats] = useState<IDashboardStats>(EMPTY_DASHBOARD_STATS)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [hasError, setHasError] = useState<boolean>(false)

    useEffect(() => {
        async function loadStats() {
            const result = await fetchDashboardStats()
            setHasError(!result.ok)
            setStats(result.stats)
            setIsLoading(false)
        }

        loadStats()
        const interval = setInterval(loadStats, DASHBOARD_POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className={styles.dashboard} data-testid="dashboard-container">
            <h2 className={styles.dashboardTitle}>Dashboard</h2>
            <ul className={styles.dashboardStats} aria-label="Métricas del día">
                <StatCard
                    label="Pedidos hoy"
                    value={String(stats.ordersToday)}
                    icon="&#128203;"
                    testId="stat-orders-today"
                    isLoading={isLoading}
                    hasError={hasError}
                />
                <StatCard
                    label="Ingresos hoy"
                    value={`$${stats.revenueToday.toFixed(2)}`}
                    icon="&#36;"
                    testId="stat-revenue-today"
                    isLoading={isLoading}
                    hasError={hasError}
                />
                <StatCard
                    label="Pedidos activos"
                    value={String(stats.activeOrders)}
                    icon="&#9889;"
                    testId="stat-active-orders"
                    isLoading={isLoading}
                    hasError={hasError}
                />
                <StatCard
                    label="Pagos pendientes"
                    value={String(stats.pendingPayments)}
                    icon="&#9203;"
                    testId="stat-pending-payments"
                    isLoading={isLoading}
                    hasError={hasError}
                />
            </ul>
        </section>
    )
}

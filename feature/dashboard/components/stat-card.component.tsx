"use client"

import styles from "../styles/dashboard.style.module.css"

interface StatCardProps {
    label: string
    value: string
    icon: string
    testId: string
    isLoading: boolean
    hasError: boolean
}

export function StatCard({ label, value, icon, testId, isLoading, hasError }: StatCardProps) {
    if (isLoading) {
        return (
            <li className={`${styles.dashboardStatCard} ${styles.skeletonCard}`} data-testid={testId} aria-busy="true">
                <span className={styles.skeletonIcon} aria-hidden="true" />
                <span className={styles.skeletonValue} aria-hidden="true" />
                <span className={styles.skeletonLabel} aria-hidden="true" />
            </li>
        )
    }

    const displayValue = hasError ? "--" : value

    return (
        <li className={styles.dashboardStatCard} data-testid={testId}>
            <span className={styles.dashboardStatIcon} aria-hidden="true">{icon}</span>
            <span className={styles.dashboardStatValue}>{displayValue}</span>
            <span className={styles.dashboardStatLabel}>{label}</span>
            {hasError && (
                <span className={styles.dashboardStatError} role="alert">Sin datos</span>
            )}
        </li>
    )
}

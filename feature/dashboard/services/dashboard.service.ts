import { apiRequest } from "@/feature/shared/lib/api-client"

export interface IDashboardStats {
    ordersToday: number
    revenueToday: number
    activeOrders: number
    pendingPayments: number
}

export const EMPTY_DASHBOARD_STATS: IDashboardStats = {
    ordersToday: 0,
    revenueToday: 0,
    activeOrders: 0,
    pendingPayments: 0,
}

interface ApiDashboardStatsBody {
    orders_today?: number
    revenue_today?: number
    active_orders?: number
    pending_payments?: number
}

export interface IDashboardStatsResult {
    stats: IDashboardStats
    ok: boolean
}

export async function fetchDashboardStats(): Promise<IDashboardStatsResult> {
    const result = await apiRequest<ApiDashboardStatsBody>("/api/v1/backoffice/dashboard/stats")
    if (!result.ok) return { stats: EMPTY_DASHBOARD_STATS, ok: false }
    return {
        ok: true,
        stats: {
            ordersToday: result.data.orders_today ?? 0,
            revenueToday: result.data.revenue_today ?? 0,
            activeOrders: result.data.active_orders ?? 0,
            pendingPayments: result.data.pending_payments ?? 0,
        },
    }
}

"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { fetchOrders } from "@/feature/orders/services/order.service"
import type { IOrder } from "@/feature/orders/interfaces/order.interface"
import { OrderStatus } from "@/feature/orders/interfaces/order.interface"
import { EMPTY_ORDER, ORDER_POLL_INTERVAL_MS } from "@/feature/orders/constants/order.constant"

interface IUseOrderList {
    orders: IOrder[]
    statusFilter: string
    selectedOrder: IOrder
    isLoading: boolean
    setStatusFilter: (status: string) => void
    setSelectedOrder: (order: IOrder) => void
    refresh: () => Promise<void>
    updateOrderInList: (updated: IOrder) => void
}

export function useOrderList(): IUseOrderList {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [statusFilter, setStatusFilterState] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<IOrder>(EMPTY_ORDER)
    const [isLoading, setIsLoading] = useState(false)
    const statusFilterRef = useRef("")

    const refresh = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchOrders(statusFilterRef.current as OrderStatus | "")
        setOrders(result.orders)
        setSelectedOrder((prev) => {
            if (prev.id === "") return prev
            const updated = result.orders.find((o) => o.id === prev.id)
            return updated ?? prev
        })
        setIsLoading(false)
    }, [])

    useEffect(() => {
        refresh()
        const interval = setInterval(refresh, ORDER_POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [refresh])

    const setStatusFilter = useCallback(
        (status: string) => {
            statusFilterRef.current = status
            setStatusFilterState(status)
            refresh()
        },
        [refresh]
    )

    const updateOrderInList = useCallback((updated: IOrder) => {
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
        setSelectedOrder((prev) => (prev.id === updated.id ? updated : prev))
    }, [])

    return { orders, statusFilter, selectedOrder, isLoading, setStatusFilter, setSelectedOrder, refresh, updateOrderInList }
}

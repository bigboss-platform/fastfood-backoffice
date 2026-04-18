"use client"

import { useState, useCallback } from "react"
import { fetchOrders } from "@/feature/orders/services/order.service"
import type { IOrder } from "@/feature/orders/interfaces/order.interface"
import { EMPTY_ORDER } from "@/feature/orders/constants/order.constant"

interface IUseOrderList {
    orders: IOrder[]
    statusFilter: string
    selectedOrder: IOrder
    isLoading: boolean
    setStatusFilter: (status: string) => void
    setSelectedOrder: (order: IOrder) => void
    refresh: () => Promise<void>
}

export function useOrderList(accessToken: string): IUseOrderList {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [statusFilter, setStatusFilter] = useState("")
    const [selectedOrder, setSelectedOrder] = useState<IOrder>(EMPTY_ORDER)
    const [isLoading, setIsLoading] = useState(false)

    const refresh = useCallback(async () => {
        setIsLoading(true)
        const result = await fetchOrders(accessToken, statusFilter as IOrder["status"] | "")
        setOrders(result.orders)
        setIsLoading(false)
    }, [accessToken, statusFilter])

    return { orders, statusFilter, selectedOrder, isLoading, setStatusFilter, setSelectedOrder, refresh }
}

"use client"

import { useState, useEffect, useCallback } from "react"
import type { IOrder } from "../../orders/interfaces/order.interface"
import { OrderStatus } from "../../orders/interfaces/order.interface"
import { fetchActiveOrders, updateOrderStatus } from "../../orders/services/order.service"
import { ORDER_POLL_INTERVAL_MS } from "../../orders/constants/order.constant"

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
    [OrderStatus.PREPARING]: OrderStatus.READY,
}

function sortByCreatedAt(orders: IOrder[]): IOrder[] {
    return [...orders].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

export interface ChefBoardHook {
    orders: IOrder[]
    advancingIds: Set<string>
    errorIds: Set<string>
    advanceOrder: (order: IOrder) => void
}

export function useChefBoard(): ChefBoardHook {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [advancingIds, setAdvancingIds] = useState<Set<string>>(new Set())
    const [errorIds, setErrorIds] = useState<Set<string>>(new Set())

    const loadOrders = useCallback(async () => {
        const result = await fetchActiveOrders()
        setOrders(sortByCreatedAt(result.orders))
    }, [])

    useEffect(() => {
        loadOrders()
        const interval = setInterval(loadOrders, ORDER_POLL_INTERVAL_MS)
        return () => clearInterval(interval)
    }, [loadOrders])

    const advanceOrder = useCallback(async (order: IOrder) => {
        const nextStatus = NEXT_STATUS[order.status]
        if (!nextStatus) return

        setAdvancingIds((prev) => new Set(prev).add(order.id))

        if (nextStatus === OrderStatus.READY) {
            setOrders((prev) => prev.filter((o) => o.id !== order.id))
        } else {
            setOrders((prev) =>
                prev.map((o) => (o.id === order.id ? { ...o, status: nextStatus } : o))
            )
        }

        const updated = await updateOrderStatus(order.id, nextStatus)
        const failed = updated.id === ""

        if (failed) {
            setOrders((prev) => {
                const exists = prev.some((o) => o.id === order.id)
                if (exists) {
                    return prev.map((o) => (o.id === order.id ? { ...o, status: order.status } : o))
                }
                return sortByCreatedAt([...prev, order])
            })
            setErrorIds((prev) => new Set(prev).add(order.id))
            setTimeout(() => {
                setErrorIds((prev) => {
                    const next = new Set(prev)
                    next.delete(order.id)
                    return next
                })
            }, 3000)
        }

        setAdvancingIds((prev) => {
            const next = new Set(prev)
            next.delete(order.id)
            return next
        })
    }, [])

    return { orders, advancingIds, errorIds, advanceOrder }
}

"use client"

import { useState, useCallback } from "react"
import type { IOrder } from "@/feature/orders/interfaces/order.interface"
import { OrderStatus, PaymentStatus } from "@/feature/orders/interfaces/order.interface"
import { updateOrderStatus, updateOrderPayment } from "@/feature/orders/services/order.service"
import { EMPTY_ORDER } from "@/feature/orders/constants/order.constant"
import { getNextStatus, canCancelOrder } from "@/feature/orders/utils/order-status.util"

export interface PaymentFormValues {
    paymentStatus: PaymentStatus
    paymentMethod: string
    paymentAmountReceived: number
    paymentReference: string
    paymentNotes: string
}

interface IUseOrderDetail {
    isSubmitting: boolean
    advanceStatus: (order: IOrder) => Promise<IOrder>
    cancelOrder: (order: IOrder) => Promise<IOrder>
    savePayment: (orderId: string, values: PaymentFormValues) => Promise<IOrder>
}

export function useOrderDetail(): IUseOrderDetail {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const advanceStatus = useCallback(async (order: IOrder): Promise<IOrder> => {
        const nextStatus = getNextStatus(order.status)
        if (nextStatus === undefined) return EMPTY_ORDER
        setIsSubmitting(true)
        const result = await updateOrderStatus(order.id, nextStatus)
        setIsSubmitting(false)
        return result
    }, [])

    const cancelOrder = useCallback(async (order: IOrder): Promise<IOrder> => {
        if (!canCancelOrder(order.status)) return EMPTY_ORDER
        setIsSubmitting(true)
        const result = await updateOrderStatus(order.id, OrderStatus.CANCELLED)
        setIsSubmitting(false)
        return result
    }, [])

    const savePayment = useCallback(async (orderId: string, values: PaymentFormValues): Promise<IOrder> => {
        setIsSubmitting(true)
        const result = await updateOrderPayment(orderId, values)
        setIsSubmitting(false)
        return result
    }, [])

    return { isSubmitting, advanceStatus, cancelOrder, savePayment }
}

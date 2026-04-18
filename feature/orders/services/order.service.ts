"use server"

import type { IOrder } from "../interfaces/order.interface"
import type { OrderStatus, PaymentStatus } from "../interfaces/order.interface"
import { EMPTY_ORDER } from "../constants/order.constant"

interface OrderListResponse {
    orders: IOrder[]
    total: number
}

export async function fetchOrders(
    accessToken: string,
    statusFilter: OrderStatus | ""
): Promise<OrderListResponse> {
    const queryString = statusFilter !== "" ? `?status=${statusFilter}` : ""
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/backoffice/orders${queryString}`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                cache: "no-store",
            }
        )
        if (!response.ok) return { orders: [], total: 0 }
        const body: { data?: IOrder[]; meta?: { total?: number } } = await response.json()
        return { orders: body.data ?? [], total: body.meta?.total ?? 0 }
    } catch {
        return { orders: [], total: 0 }
    }
}

export async function updateOrderStatus(
    accessToken: string,
    orderId: string,
    status: OrderStatus
): Promise<IOrder> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/backoffice/orders/${orderId}/status`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
                cache: "no-store",
            }
        )
        if (!response.ok) return EMPTY_ORDER
        const body: { data?: IOrder } = await response.json()
        return body.data ?? EMPTY_ORDER
    } catch {
        return EMPTY_ORDER
    }
}

interface PaymentUpdatePayload {
    paymentStatus: PaymentStatus
    paymentMethod: string
    paymentAmountReceived: number
    paymentReference: string
    paymentNotes: string
}

export async function updateOrderPayment(
    accessToken: string,
    orderId: string,
    payload: PaymentUpdatePayload
): Promise<IOrder> {
    try {
        const response = await fetch(
            `${process.env.API_BASE_URL}/api/v1/backoffice/orders/${orderId}/payment`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payment_status: payload.paymentStatus,
                    payment_method: payload.paymentMethod,
                    payment_amount_received: payload.paymentAmountReceived,
                    payment_reference: payload.paymentReference,
                    payment_notes: payload.paymentNotes,
                }),
                cache: "no-store",
            }
        )
        if (!response.ok) return EMPTY_ORDER
        const body: { data?: IOrder } = await response.json()
        return body.data ?? EMPTY_ORDER
    } catch {
        return EMPTY_ORDER
    }
}

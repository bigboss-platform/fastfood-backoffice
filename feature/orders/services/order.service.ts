import { apiRequest } from "@/feature/shared/lib/api-client"
import type { IOrder, OrderStatus, PaymentStatus } from "../interfaces/order.interface"
import { EMPTY_ORDER } from "../constants/order.constant"

interface ApiOrderListBody {
    data?: IOrder[]
    meta?: { total?: number }
}

interface ApiOrderBody {
    data?: IOrder
}

interface OrderListResponse {
    orders: IOrder[]
    total: number
}

export interface PaymentUpdatePayload {
    paymentStatus: PaymentStatus
    paymentMethod: string
    paymentAmountReceived: number
    paymentReference: string
    paymentNotes: string
}

export async function fetchOrders(statusFilter: OrderStatus | ""): Promise<OrderListResponse> {
    const queryString = statusFilter !== "" ? `?status=${statusFilter}` : ""
    const result = await apiRequest<ApiOrderListBody>(`/api/v1/backoffice/orders${queryString}`)
    if (!result.ok) return { orders: [], total: 0 }
    return {
        orders: result.data.data ?? [],
        total: result.data.meta?.total ?? 0,
    }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<IOrder> {
    const result = await apiRequest<ApiOrderBody>(`/api/v1/backoffice/orders/${orderId}/status`, {
        method: "PUT",
        body: { status },
    })
    if (!result.ok) return EMPTY_ORDER
    return result.data.data ?? EMPTY_ORDER
}

export async function fetchActiveOrders(): Promise<OrderListResponse> {
    const result = await apiRequest<ApiOrderListBody>(`/api/v1/backoffice/orders?status=confirmed,preparing`)
    if (!result.ok) return { orders: [], total: 0 }
    return {
        orders: result.data.data ?? [],
        total: result.data.meta?.total ?? 0,
    }
}

export async function updateOrderPayment(orderId: string, payload: PaymentUpdatePayload): Promise<IOrder> {
    const result = await apiRequest<ApiOrderBody>(`/api/v1/backoffice/orders/${orderId}/payment`, {
        method: "PATCH",
        body: {
            payment_status: payload.paymentStatus,
            payment_method: payload.paymentMethod,
            payment_amount_received: payload.paymentAmountReceived,
            payment_reference: payload.paymentReference,
            payment_notes: payload.paymentNotes,
        },
    })
    if (!result.ok) return EMPTY_ORDER
    return result.data.data ?? EMPTY_ORDER
}

import type { IOrderItem } from "./order-item.interface"

export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

export enum PaymentStatus {
    PENDING = "pending",
    PARTIALLY_PAID = "partially_paid",
    PAID = "paid",
    WAIVED = "waived",
}

export interface IOrder {
    id: string
    endUserId: string
    status: OrderStatus
    deliveryType: string
    deliveryAddress: string
    deliveryLat: number
    deliveryLng: number
    deliveryCost: number
    subtotal: number
    total: number
    notes: string
    paymentStatus: PaymentStatus
    paymentMethod: string
    paymentAmountReceived: number
    paymentReference: string
    paymentNotes: string
    items: IOrderItem[]
    createdAt: string
}

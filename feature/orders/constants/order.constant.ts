import { type IOrder, OrderStatus, PaymentStatus } from "../interfaces/order.interface"

export const EMPTY_ORDER: IOrder = {
    id: "",
    endUserId: "",
    status: OrderStatus.PENDING,
    deliveryType: "pickup",
    deliveryAddress: "",
    deliveryLat: 0,
    deliveryLng: 0,
    deliveryCost: 0,
    subtotal: 0,
    total: 0,
    notes: "",
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: "",
    paymentAmountReceived: 0,
    paymentReference: "",
    paymentNotes: "",
    items: [],
    createdAt: "",
}

export const ORDER_STATUS_DISPLAY: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: "Esperando confirmación",
    [OrderStatus.CONFIRMED]: "Confirmado",
    [OrderStatus.PREPARING]: "En preparación",
    [OrderStatus.READY]: "Listo",
    [OrderStatus.DELIVERED]: "Entregado",
    [OrderStatus.CANCELLED]: "Cancelado",
}

export const NEXT_STATUS_DISPLAY: Partial<Record<OrderStatus, string>> = {
    [OrderStatus.PENDING]: "Marcar como confirmado",
    [OrderStatus.CONFIRMED]: "Marcar como preparando",
    [OrderStatus.PREPARING]: "Marcar como listo",
    [OrderStatus.READY]: "Marcar como entregado",
}

export const STATUS_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus>> = {
    [OrderStatus.PENDING]: OrderStatus.CONFIRMED,
    [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
    [OrderStatus.PREPARING]: OrderStatus.READY,
    [OrderStatus.READY]: OrderStatus.DELIVERED,
}

export const PAYMENT_STATUS_DISPLAY: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Pendiente",
    [PaymentStatus.PARTIALLY_PAID]: "Pago parcial",
    [PaymentStatus.PAID]: "Pagado",
    [PaymentStatus.WAIVED]: "Sin cobro",
}

export const ORDER_POLL_INTERVAL_MS = 10000

import { type IOrder, OrderStatus, PaymentStatus } from "../interfaces/order.interface"

export const EMPTY_ORDER: IOrder = {
    id: "",
    endUserId: "",
    status: OrderStatus.PENDING,
    deliveryType: "pickup",
    deliveryAddress: "",
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

export const PAYMENT_STATUS_DISPLAY: Record<PaymentStatus, string> = {
    [PaymentStatus.PENDING]: "Pendiente",
    [PaymentStatus.PARTIALLY_PAID]: "Pago parcial",
    [PaymentStatus.PAID]: "Pagado",
    [PaymentStatus.WAIVED]: "Condonado",
}

export const ORDER_POLL_INTERVAL_MS = 10000

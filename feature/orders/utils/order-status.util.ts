import { OrderStatus } from "../interfaces/order.interface"
import { STATUS_TRANSITIONS } from "../constants/order.constant"

export function getNextStatus(current: OrderStatus): OrderStatus | undefined {
    return STATUS_TRANSITIONS[current]
}

export function canAdvanceStatus(status: OrderStatus): boolean {
    return getNextStatus(status) !== undefined
}

export function canCancelOrder(status: OrderStatus): boolean {
    return status !== OrderStatus.DELIVERED && status !== OrderStatus.CANCELLED
}

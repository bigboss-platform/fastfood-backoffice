"use client"

import { useState } from "react"
import type { IOrder } from "../interfaces/order.interface"
import { OrderStatus, PaymentStatus } from "../interfaces/order.interface"
import { EMPTY_ORDER, ORDER_STATUS_DISPLAY, PAYMENT_STATUS_DISPLAY } from "../constants/order.constant"
import styles from "../styles/order-list.style.module.css"

export function OrderListContainer() {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [selectedOrder, setSelectedOrder] = useState<IOrder>(EMPTY_ORDER)
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("")
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function handleStatusFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setStatusFilter(event.target.value as OrderStatus | "")
    }

    function handleSelectOrder(order: IOrder) {
        setSelectedOrder(order)
    }

    return (
        <section className={styles.orderList}>
            <header className={styles.orderListHeader}>
                <h2 className={styles.orderListTitle}>Pedidos</h2>
                <select
                    className={styles.orderListFilter}
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    aria-label="Filtrar por estado"
                >
                    <option value="">Todos los estados</option>
                    {Object.values(OrderStatus).map((status) => (
                        <option key={status} value={status}>
                            {ORDER_STATUS_DISPLAY[status]}
                        </option>
                    ))}
                </select>
            </header>

            {isLoading && (
                <p className={styles.orderListLoading} aria-live="polite">
                    Cargando pedidos...
                </p>
            )}

            <ul className={styles.orderListItems} aria-label="Lista de pedidos">
                {orders.map((order) => (
                    <li key={order.id} className={styles.orderListItem}>
                        <button
                            type="button"
                            className={styles.orderListItemButton}
                            onClick={() => handleSelectOrder(order)}
                        >
                            <span className={styles.orderListItemId}>#{order.id.slice(-6)}</span>
                            <span className={styles.orderListItemStatus}>
                                {ORDER_STATUS_DISPLAY[order.status]}
                            </span>
                            <span className={styles.orderListItemPayment}>
                                {PAYMENT_STATUS_DISPLAY[order.paymentStatus]}
                            </span>
                            <span className={styles.orderListItemTotal}>
                                ${order.total.toFixed(2)}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

"use client"

import { useState, useEffect } from "react"
import type { IOrder } from "../../orders/interfaces/order.interface"
import { OrderStatus } from "../../orders/interfaces/order.interface"
import { ORDER_STATUS_DISPLAY, ORDER_POLL_INTERVAL_MS } from "../../orders/constants/order.constant"
import styles from "../styles/chef-board.style.module.css"

const CHEF_ACTIVE_STATUSES: OrderStatus[] = [
    OrderStatus.CONFIRMED,
    OrderStatus.PREPARING,
]

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
    [OrderStatus.PREPARING]: OrderStatus.READY,
}

export function ChefBoardContainer() {
    const [activeOrders, setActiveOrders] = useState<IOrder[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    function handleAdvanceStatus(order: IOrder) {
        const nextStatus = NEXT_STATUS[order.status as OrderStatus]
        if (!nextStatus) {
            return
        }
        // Status update wired in next iteration
    }

    return (
        <section className={styles.chefBoard} aria-label="Vista de cocina">
            <header className={styles.chefBoardHeader}>
                <h2 className={styles.chefBoardTitle}>Cocina</h2>
                <span className={styles.chefBoardCount} aria-live="polite">
                    {activeOrders.length} pedidos activos
                </span>
            </header>

            {activeOrders.length === 0 && !isLoading && (
                <p className={styles.chefBoardEmpty}>No hay pedidos activos.</p>
            )}

            <ul className={styles.chefBoardGrid} aria-label="Pedidos activos">
                {activeOrders.map((order) => (
                    <li key={order.id} className={styles.chefBoardCard}>
                        <header className={styles.chefBoardCardHeader}>
                            <span className={styles.chefBoardCardId}>
                                #{order.id.slice(-6)}
                            </span>
                            <span className={styles.chefBoardCardStatus}>
                                {ORDER_STATUS_DISPLAY[order.status as OrderStatus]}
                            </span>
                        </header>
                        <ul className={styles.chefBoardCardItems} aria-label="Items del pedido">
                            {order.items.map((item) => (
                                <li key={item.id} className={styles.chefBoardCardItem}>
                                    <span className={styles.chefBoardCardItemQuantity}>
                                        {item.quantity}x
                                    </span>
                                    <span className={styles.chefBoardCardItemName}>
                                        {item.menuItemName}
                                    </span>
                                    {item.note !== "" && (
                                        <span className={styles.chefBoardCardItemNote}>
                                            {item.note}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {NEXT_STATUS[order.status as OrderStatus] && (
                            <button
                                type="button"
                                className={styles.chefBoardCardButton}
                                onClick={() => handleAdvanceStatus(order)}
                                aria-label={`Avanzar pedido ${order.id.slice(-6)} al siguiente estado`}
                            >
                                {ORDER_STATUS_DISPLAY[NEXT_STATUS[order.status as OrderStatus]!]}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}

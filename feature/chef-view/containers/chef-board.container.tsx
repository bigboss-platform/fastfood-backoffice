"use client"

import { useState } from "react"
import type { IOrder } from "../../orders/interfaces/order.interface"
import { OrderStatus } from "../../orders/interfaces/order.interface"
import { ORDER_STATUS_DISPLAY } from "../../orders/constants/order.constant"
import styles from "../styles/chef-board.style.module.css"

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
    [OrderStatus.CONFIRMED]: OrderStatus.PREPARING,
    [OrderStatus.PREPARING]: OrderStatus.READY,
}

export function ChefBoardContainer() {
    const [activeOrders] = useState<IOrder[]>([])
    const [isLoading] = useState<boolean>(false)

    function handleAdvanceStatus(order: IOrder) {
        const nextStatus = NEXT_STATUS[order.status as OrderStatus]
        if (!nextStatus) {
            return
        }
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
                {activeOrders.map((order) => {
                    const nextStatus = NEXT_STATUS[order.status as OrderStatus]
                    return (
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
                            {nextStatus && (
                                <button
                                    type="button"
                                    className={styles.chefBoardCardButton}
                                    onClick={() => handleAdvanceStatus(order)}
                                    aria-label={`Avanzar pedido ${order.id.slice(-6)} al siguiente estado`}
                                >
                                    {ORDER_STATUS_DISPLAY[nextStatus]}
                                </button>
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

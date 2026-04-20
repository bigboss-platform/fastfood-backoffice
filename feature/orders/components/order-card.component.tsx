"use client"

import type { IOrder } from "../interfaces/order.interface"
import { ORDER_STATUS_DISPLAY, PAYMENT_STATUS_DISPLAY } from "../constants/order.constant"
import { getTimeElapsed, isNewOrder } from "../utils/order-time.util"
import styles from "../styles/order-card.style.module.css"

interface OrderCardProps {
    order: IOrder
    isSelected: boolean
    onClick: (order: IOrder) => void
}

export function OrderCard({ order, isSelected, onClick }: OrderCardProps) {
    function handleClick() {
        onClick(order)
    }

    const timeElapsed = getTimeElapsed(order.createdAt)
    const isNew = isNewOrder(order.createdAt)

    return (
        <li data-testid="order-card" className={`${styles.card} ${isSelected ? styles.cardSelected : ""}`}>
            <button type="button" className={styles.cardButton} onClick={handleClick}>
                <div className={styles.cardHeader}>
                    <span className={styles.cardId}>#{order.id.slice(-6)}</span>
                    {isNew && <span className={styles.newBadge}>NUEVO</span>}
                    <span className={styles.cardTime}>{timeElapsed}</span>
                </div>
                <div className={styles.cardBadges}>
                    <span className={styles.statusBadge}>{ORDER_STATUS_DISPLAY[order.status]}</span>
                    <span className={styles.paymentBadge}>{PAYMENT_STATUS_DISPLAY[order.paymentStatus]}</span>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.cardDelivery}>{order.deliveryType}</span>
                    <span className={styles.cardTotal}>${order.total.toFixed(2)}</span>
                </div>
            </button>
        </li>
    )
}

"use client"

import { useState, useEffect } from "react"
import type { IOrder } from "../../orders/interfaces/order.interface"
import { OrderStatus } from "../../orders/interfaces/order.interface"
import styles from "../styles/chef-order-card.style.module.css"

const ADVANCE_BUTTON_LABEL: Partial<Record<OrderStatus, string>> = {
    [OrderStatus.CONFIRMED]: "Empezar a preparar",
    [OrderStatus.PREPARING]: "Listo",
}

const DELIVERY_TYPE_LABEL: Record<string, string> = {
    pickup: "Recoger",
}

const WARNING_THRESHOLD_MINUTES = 15

function getElapsedMinutes(createdAt: string): number {
    return Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000)
}

interface Props {
    order: IOrder
    isAdvancing: boolean
    hasError: boolean
    onAdvance: (order: IOrder) => void
}

export function ChefOrderCardComponent({ order, isAdvancing, hasError, onAdvance }: Props) {
    const [elapsedMinutes, setElapsedMinutes] = useState(() => getElapsedMinutes(order.createdAt))

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedMinutes(getElapsedMinutes(order.createdAt))
        }, 60000)
        return () => clearInterval(interval)
    }, [order.createdAt])

    const buttonLabel = ADVANCE_BUTTON_LABEL[order.status]
    const deliveryLabel = DELIVERY_TYPE_LABEL[order.deliveryType] ?? "Envío"
    const isWarning = elapsedMinutes >= WARNING_THRESHOLD_MINUTES

    const cardClasses = [styles.card]
    if (isWarning) cardClasses.push(styles.cardWarning)
    if (hasError) cardClasses.push(styles.cardError)

    return (
        <li className={cardClasses.join(" ")} data-testid="chef-order-card">
            <header className={styles.cardHeader}>
                <span className={styles.cardId}>#{order.id.slice(-6)}</span>
                <span className={styles.cardDeliveryBadge}>{deliveryLabel}</span>
            </header>
            <div className={styles.cardMeta}>
                <span className={styles.cardElapsed}>hace {elapsedMinutes} min</span>
                {hasError && (
                    <span className={styles.cardErrorIndicator}>Error al actualizar</span>
                )}
            </div>
            <ul className={styles.cardItems} aria-label="Items del pedido">
                {order.items.map((item) => (
                    <li key={item.id} className={styles.cardItem}>
                        <span className={styles.cardItemQuantity}>{item.quantity}x</span>
                        <span className={styles.cardItemName}>{item.menuItemName}</span>
                        {item.note !== "" && (
                            <span className={styles.cardItemNote}>{item.note}</span>
                        )}
                    </li>
                ))}
            </ul>
            {buttonLabel && (
                <button
                    type="button"
                    className={styles.cardButton}
                    onClick={() => onAdvance(order)}
                    disabled={isAdvancing}
                    aria-label={`Avanzar pedido ${order.id.slice(-6)}`}
                    data-testid="chef-advance-button"
                >
                    {buttonLabel}
                </button>
            )}
        </li>
    )
}

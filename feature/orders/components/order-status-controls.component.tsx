"use client"

import type { IOrder } from "../interfaces/order.interface"
import { ORDER_STATUS_DISPLAY, NEXT_STATUS_DISPLAY } from "../constants/order.constant"
import { canAdvanceStatus, canCancelOrder } from "../utils/order-status.util"
import styles from "../styles/order-detail-panel.style.module.css"

interface OrderStatusControlsProps {
    order: IOrder
    isSubmitting: boolean
    onAdvance: () => void
    onCancel: () => void
}

export function OrderStatusControls({ order, isSubmitting, onAdvance, onCancel }: OrderStatusControlsProps) {
    const nextLabel = NEXT_STATUS_DISPLAY[order.status]
    const canAdvance = canAdvanceStatus(order.status)
    const canCancel = canCancelOrder(order.status)

    return (
        <section className={styles.statusSection}>
            <h3 className={styles.sectionTitle}>Estado</h3>
            <p className={styles.currentStatus}>{ORDER_STATUS_DISPLAY[order.status]}</p>
            <div className={styles.statusActions}>
                {canAdvance && nextLabel !== undefined && (
                    <button
                        type="button"
                        className={styles.advanceButton}
                        onClick={onAdvance}
                        disabled={isSubmitting}
                        data-testid="advance-status-button"
                    >
                        {nextLabel}
                    </button>
                )}
                {canCancel && (
                    <button
                        type="button"
                        className={styles.cancelOrderButton}
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancelar pedido
                    </button>
                )}
            </div>
        </section>
    )
}

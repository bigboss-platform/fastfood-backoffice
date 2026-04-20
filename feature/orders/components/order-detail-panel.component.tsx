"use client"

import type { IOrder } from "../interfaces/order.interface"
import { OrderStatusControls } from "./order-status-controls.component"
import { OrderPaymentForm } from "./order-payment-form.component"
import type { PaymentFormValues } from "../hooks/use-order-detail.hook"
import styles from "../styles/order-detail-panel.style.module.css"

interface OrderDetailPanelProps {
    order: IOrder
    isSubmitting: boolean
    onAdvance: () => void
    onCancelOrder: () => void
    onSavePayment: (orderId: string, values: PaymentFormValues) => void
    onClose: () => void
}

export function OrderDetailPanel({
    order,
    isSubmitting,
    onAdvance,
    onCancelOrder,
    onSavePayment,
    onClose,
}: OrderDetailPanelProps) {
    const isDelivery = order.deliveryType === "delivery"
    const hasDeliveryAddress = order.deliveryAddress !== "" && isDelivery
    const hasDeliveryCoordinates = isDelivery && Boolean(order.deliveryLat) && Boolean(order.deliveryLng)
    const googleMapsUrl = `https://maps.google.com/?q=${order.deliveryLat},${order.deliveryLng}`
    const hasNotes = order.notes !== ""
    const hasCreatedAt = order.createdAt !== ""
    const createdAtDisplay = hasCreatedAt ? new Date(order.createdAt).toLocaleString("es-MX") : ""

    return (
        <aside className={styles.panel} data-testid="order-detail">
            <header className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Pedido #{order.id.slice(-6)}</h2>
                <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
                    ✕
                </button>
            </header>

            <div className={styles.panelBody}>
                <section className={styles.infoSection}>
                    <dl className={styles.infoList}>
                        <dt>Tipo</dt>
                        <dd>{order.deliveryType}</dd>
                        {hasDeliveryAddress && (
                            <>
                                <dt>Dirección</dt>
                                <dd>{order.deliveryAddress}</dd>
                            </>
                        )}
                        {hasDeliveryCoordinates && (
                            <>
                                <dt>Mapa</dt>
                                <dd>
                                    <a
                                        data-testid="google-maps-link"
                                        href={googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.mapsLink}
                                    >
                                        Ver en Google Maps
                                    </a>
                                </dd>
                            </>
                        )}
                        {hasNotes && (
                            <>
                                <dt>Notas</dt>
                                <dd>{order.notes}</dd>
                            </>
                        )}
                        {hasCreatedAt && (
                            <>
                                <dt>Fecha</dt>
                                <dd>{createdAtDisplay}</dd>
                            </>
                        )}
                    </dl>
                </section>

                <section className={styles.itemsSection}>
                    <h3 className={styles.sectionTitle}>Productos</h3>
                    <ul className={styles.itemsList}>
                        {order.items.map((item) => (
                            <li key={item.id} className={styles.itemRow}>
                                <span className={styles.itemName}>{item.menuItemName}</span>
                                <span className={styles.itemQty}>x{item.quantity}</span>
                                <span className={styles.itemPrice}>
                                    ${(item.menuItemPrice * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.totals}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Envío</span>
                            <span>${order.deliveryCost.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                            <span>Total</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <OrderStatusControls
                    order={order}
                    isSubmitting={isSubmitting}
                    onAdvance={onAdvance}
                    onCancel={onCancelOrder}
                />

                <OrderPaymentForm order={order} isSubmitting={isSubmitting} onSave={onSavePayment} />
            </div>
        </aside>
    )
}

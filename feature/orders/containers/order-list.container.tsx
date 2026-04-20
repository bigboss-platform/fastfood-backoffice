"use client"

import { useOrderList } from "@/feature/orders/hooks/use-order-list.hook"
import { useOrderDetail } from "@/feature/orders/hooks/use-order-detail.hook"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { OrderCard } from "@/feature/orders/components/order-card.component"
import { OrderDetailPanel } from "@/feature/orders/components/order-detail-panel.component"
import { Toast } from "@/feature/shared/components/toast.component"
import { OrderStatus } from "@/feature/orders/interfaces/order.interface"
import { EMPTY_ORDER, ORDER_STATUS_DISPLAY } from "@/feature/orders/constants/order.constant"
import type { PaymentFormValues } from "@/feature/orders/hooks/use-order-detail.hook"
import styles from "@/feature/orders/styles/order-list.style.module.css"

type FilterValue = OrderStatus | ""

const STATUS_FILTER_OPTIONS: Array<{ value: FilterValue; label: string; testId: string }> = [
    { value: "", label: "Todos", testId: "status-filter-all" },
    ...Object.values(OrderStatus).map((s) => ({
        value: s,
        label: ORDER_STATUS_DISPLAY[s],
        testId: `status-filter-${s}`,
    })),
]

export function OrderListContainer() {
    const { orders, statusFilter, selectedOrder, isLoading, setStatusFilter, setSelectedOrder, updateOrderInList } =
        useOrderList()
    const { isSubmitting, advanceStatus, cancelOrder, savePayment } = useOrderDetail()
    const { toast, showToast } = useToast()

    const hasSelectedOrder = selectedOrder.id !== ""
    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    async function handleAdvance() {
        const updated = await advanceStatus(selectedOrder)
        if (updated.id !== "") {
            updateOrderInList(updated)
            showToast("Estado actualizado", "success", 3000)
        } else {
            showToast("Error al actualizar el estado", "error", 5000)
        }
    }

    async function handleCancelOrder() {
        const updated = await cancelOrder(selectedOrder)
        if (updated.id !== "") {
            updateOrderInList(updated)
            showToast("Pedido cancelado", "success", 3000)
        } else {
            showToast("Error al cancelar el pedido", "error", 5000)
        }
    }

    async function handleSavePayment(orderId: string, values: PaymentFormValues) {
        const updated = await savePayment(orderId, values)
        if (updated.id !== "") {
            updateOrderInList(updated)
            showToast("Pago actualizado", "success", 3000)
        } else {
            showToast("Error al actualizar el pago", "error", 5000)
        }
    }

    function handleCloseDetail() {
        setSelectedOrder(EMPTY_ORDER)
    }

    return (
        <div className={styles.orderListPage}>
            <div className={styles.orderListMain}>
                <header className={styles.orderListHeader}>
                    <h2 className={styles.orderListTitle}>Pedidos</h2>
                    <nav className={styles.filterBar} aria-label="Filtrar por estado">
                        {STATUS_FILTER_OPTIONS.map((filter) => (
                            <button
                                key={filter.value === "" ? "all" : filter.value}
                                type="button"
                                className={`${styles.filterButton} ${statusFilter === filter.value ? styles.filterButtonActive : ""}`}
                                onClick={() => setStatusFilter(filter.value)}
                                data-testid={filter.testId}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </nav>
                </header>

                {isLoading && (
                    <p className={styles.orderListLoading} aria-live="polite">
                        Cargando pedidos...
                    </p>
                )}

                <ul className={styles.orderListItems} data-testid="order-list" aria-label="Lista de pedidos">
                    {sortedOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            isSelected={selectedOrder.id === order.id}
                            onClick={setSelectedOrder}
                        />
                    ))}
                </ul>
            </div>

            {hasSelectedOrder && (
                <OrderDetailPanel
                    order={selectedOrder}
                    isSubmitting={isSubmitting}
                    onAdvance={handleAdvance}
                    onCancelOrder={handleCancelOrder}
                    onSavePayment={handleSavePayment}
                    onClose={handleCloseDetail}
                />
            )}

            <Toast message={toast.message} type={toast.type} />
        </div>
    )
}

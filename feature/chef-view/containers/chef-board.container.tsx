"use client"

import { useChefBoard } from "../hooks/use-chef-board.hook"
import { ChefOrderCardComponent } from "../components/chef-order-card.component"
import styles from "../styles/chef-board.style.module.css"

export function ChefBoardContainer() {
    const { orders, advancingIds, errorIds, advanceOrder } = useChefBoard()

    return (
        <section
            className={styles.chefBoard}
            aria-label="Vista de cocina"
            data-testid="chef-board"
        >
            <header className={styles.chefBoardHeader}>
                <h2 className={styles.chefBoardTitle}>Cocina</h2>
                <span className={styles.chefBoardCount} aria-live="polite">
                    {orders.length} pedidos activos
                </span>
            </header>

            {orders.length === 0 && (
                <p className={styles.chefBoardEmpty}>Sin pedidos activos</p>
            )}

            <ul className={styles.chefBoardGrid} aria-label="Pedidos activos">
                {orders.map((order) => (
                    <ChefOrderCardComponent
                        key={order.id}
                        order={order}
                        isAdvancing={advancingIds.has(order.id)}
                        hasError={errorIds.has(order.id)}
                        onAdvance={advanceOrder}
                    />
                ))}
            </ul>
        </section>
    )
}

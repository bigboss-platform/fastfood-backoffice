"use client"

import styles from "../styles/menu-manager.style.module.css"

export function MenuManagerContainer() {
    return (
        <section className={styles.menuManager}>
            <h2 className={styles.menuManagerTitle}>Gestión de Menú</h2>
            <p className={styles.menuManagerPlaceholder}>
                Módulo de gestión de menú — en desarrollo.
            </p>
        </section>
    )
}

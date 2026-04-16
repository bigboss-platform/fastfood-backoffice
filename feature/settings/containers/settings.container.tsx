"use client"

import styles from "../styles/settings.style.module.css"

export function SettingsContainer() {
    return (
        <section className={styles.settings}>
            <h2 className={styles.settingsTitle}>Ajustes</h2>
            <p className={styles.settingsPlaceholder}>
                Módulo de ajustes — en desarrollo.
            </p>
        </section>
    )
}

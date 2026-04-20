"use client"

import type { IThemeSettings } from "../services/settings.service"
import styles from "../styles/theme-editor.style.module.css"

interface ThemePreviewProps {
    theme: IThemeSettings
}

export function ThemePreview({ theme }: ThemePreviewProps) {
    const cssVars = {
        "--color-primary": theme.colorPrimary || "var(--color-primary)",
        "--color-primary-foreground": theme.colorPrimaryForeground || "#ffffff",
        "--color-background": theme.colorBackground || "var(--color-background)",
        "--color-surface": theme.colorSurface || "var(--color-surface)",
        "--color-text-primary": theme.colorTextPrimary || "var(--color-text-primary)",
        "--color-text-secondary": theme.colorTextSecondary || "var(--color-text-secondary)",
        "--color-border": theme.colorBorder || "var(--color-border)",
    } as React.CSSProperties

    return (
        <div className={styles.themePreview} style={cssVars} data-testid="theme-preview">
            <p className={styles.previewLabel}>Vista previa</p>
            <div className={styles.previewCard}>
                <div className={styles.previewCardImage} aria-hidden="true" />
                <div className={styles.previewCardBody}>
                    <p className={styles.previewCardName}>Ejemplo de producto</p>
                    <p className={styles.previewCardDesc}>Descripción corta del producto</p>
                    <div className={styles.previewCardFooter}>
                        <span className={styles.previewCardPrice}>$12.50</span>
                        <button type="button" className={styles.previewCardButton}>Agregar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

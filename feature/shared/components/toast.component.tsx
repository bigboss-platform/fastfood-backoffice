"use client"

import type { ToastType } from "@/feature/shared/hooks/use-toast.hook"
import styles from "@/feature/shared/styles/toast.style.module.css"

interface ToastProps {
    message: string
    type: ToastType
}

export function Toast({ message, type }: ToastProps) {
    const hasMessage = Boolean(message)
    if (!hasMessage) return null

    return (
        <div
            className={`${styles.toast} ${styles[type]}`}
            role="status"
            aria-live="polite"
            data-testid={type === "success" ? "success-toast" : "error-toast"}
        >
            {message}
        </div>
    )
}

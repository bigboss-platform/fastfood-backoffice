"use client"

import { useState, useEffect } from "react"
import { Toast } from "@/feature/shared/components/toast.component"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { savePaymentInstructions } from "../services/settings.service"
import styles from "../styles/settings.style.module.css"

const MAX_CHARS = 500

interface PaymentInstructionsFormProps {
    initialPaymentInstructions: string
    onUnsavedChange: (hasChanges: boolean) => void
}

export function PaymentInstructionsForm({ initialPaymentInstructions, onUnsavedChange }: PaymentInstructionsFormProps) {
    const [paymentInstructions, setPaymentInstructions] = useState<string>(initialPaymentInstructions)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { toast, showToast } = useToast()

    const hasChanges = paymentInstructions !== initialPaymentInstructions
    const charCount = paymentInstructions.length
    const isOverLimit = charCount > MAX_CHARS

    useEffect(() => {
        onUnsavedChange(hasChanges)
    }, [hasChanges, onUnsavedChange])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (isOverLimit) return
        setErrorMessage("")
        setIsSaving(true)
        const ok = await savePaymentInstructions(paymentInstructions)
        setIsSaving(false)
        if (ok) {
            showToast("Instrucciones de pago actualizadas", "success")
        } else {
            setErrorMessage("No se pudo guardar. Intenta de nuevo.")
        }
    }

    return (
        <form className={styles.settingsForm} onSubmit={handleSubmit} data-testid="payment-instructions-form">
            <Toast message={toast.message} type={toast.type} />
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="paymentInstructions">
                    Instrucciones de pago
                </label>
                <textarea
                    id="paymentInstructions"
                    className={`${styles.formTextarea} ${isOverLimit ? styles.formTextareaOver : ""}`}
                    value={paymentInstructions}
                    onChange={(e) => setPaymentInstructions(e.target.value)}
                    placeholder="Ej: Solo aceptamos efectivo y transferencia"
                    rows={5}
                    data-testid="input-payment-instructions"
                />
                <span
                    className={`${styles.charCounter} ${isOverLimit ? styles.charCounterOver : ""}`}
                    aria-live="polite"
                >
                    {charCount}/{MAX_CHARS}
                </span>
            </div>
            {errorMessage !== "" && (
                <p className={styles.formError} role="alert" data-testid="payment-instructions-error">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                className={styles.formButton}
                disabled={isSaving || isOverLimit}
                data-testid="btn-save-payment-instructions"
            >
                {isSaving ? "Guardando..." : "Guardar"}
            </button>
        </form>
    )
}

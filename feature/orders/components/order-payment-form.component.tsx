"use client"

import { useState } from "react"
import type { IOrder } from "../interfaces/order.interface"
import { PaymentStatus } from "../interfaces/order.interface"
import { PAYMENT_STATUS_DISPLAY } from "../constants/order.constant"
import type { PaymentFormValues } from "../hooks/use-order-detail.hook"
import styles from "../styles/order-detail-panel.style.module.css"

interface OrderPaymentFormProps {
    order: IOrder
    isSubmitting: boolean
    onSave: (orderId: string, values: PaymentFormValues) => void
}

function buildFormValues(order: IOrder): PaymentFormValues {
    return {
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        paymentAmountReceived: order.paymentAmountReceived,
        paymentReference: order.paymentReference,
        paymentNotes: order.paymentNotes,
    }
}

export function OrderPaymentForm({ order, isSubmitting, onSave }: OrderPaymentFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [formValues, setFormValues] = useState<PaymentFormValues>(buildFormValues(order))

    function handleEdit() {
        setFormValues(buildFormValues(order))
        setIsEditing(true)
    }

    function handleCancel() {
        setIsEditing(false)
    }

    function handleSave() {
        onSave(order.id, formValues)
        setIsEditing(false)
    }

    function handleMethodChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setFormValues((prev) => ({ ...prev, paymentMethod: e.target.value }))
    }

    function handleAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormValues((prev) => ({ ...prev, paymentAmountReceived: Number(e.target.value) }))
    }

    function handleReferenceChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormValues((prev) => ({ ...prev, paymentReference: e.target.value }))
    }

    function handleNotesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setFormValues((prev) => ({ ...prev, paymentNotes: e.target.value }))
    }

    function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setFormValues((prev) => ({ ...prev, paymentStatus: e.target.value as PaymentStatus }))
    }

    return (
        <section className={styles.paymentSection}>
            <h3 className={styles.sectionTitle}>Pago</h3>
            <p className={styles.paymentStatus}>
                Estado: <strong>{PAYMENT_STATUS_DISPLAY[order.paymentStatus]}</strong>
            </p>

            {!isEditing && (
                <button
                    type="button"
                    className={styles.editButton}
                    onClick={handleEdit}
                    data-testid="edit-payment-button"
                >
                    Editar pago
                </button>
            )}

            {isEditing && (
                <form className={styles.paymentForm} onSubmit={(e) => e.preventDefault()}>
                    <label className={styles.formLabel}>
                        Método de pago
                        <select
                            className={styles.formSelect}
                            value={formValues.paymentMethod}
                            onChange={handleMethodChange}
                            data-testid="payment-method-input"
                        >
                            <option value="">Seleccionar</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </label>

                    <label className={styles.formLabel}>
                        Monto recibido
                        <input
                            type="number"
                            className={styles.formInput}
                            value={formValues.paymentAmountReceived}
                            onChange={handleAmountChange}
                            min="0"
                            step="0.01"
                            data-testid="payment-amount-input"
                        />
                    </label>

                    <label className={styles.formLabel}>
                        Referencia
                        <input
                            type="text"
                            className={styles.formInput}
                            value={formValues.paymentReference}
                            onChange={handleReferenceChange}
                            data-testid="payment-reference-input"
                        />
                    </label>

                    <label className={styles.formLabel}>
                        Notas
                        <textarea
                            className={styles.formTextarea}
                            value={formValues.paymentNotes}
                            onChange={handleNotesChange}
                            data-testid="payment-notes-input"
                        />
                    </label>

                    <label className={styles.formLabel}>
                        Estado de pago
                        <select
                            className={styles.formSelect}
                            value={formValues.paymentStatus}
                            onChange={handleStatusChange}
                            data-testid="payment-status-input"
                        >
                            <option value={PaymentStatus.PENDING}>Pendiente</option>
                            <option value={PaymentStatus.PARTIALLY_PAID}>Parcial</option>
                            <option value={PaymentStatus.PAID}>Pagado</option>
                            <option value={PaymentStatus.WAIVED}>Sin cobro</option>
                        </select>
                    </label>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.saveButton}
                            onClick={handleSave}
                            disabled={isSubmitting}
                            data-testid="save-payment-button"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </section>
    )
}

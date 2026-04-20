"use client"

import { useState, useEffect } from "react"
import { Toast } from "@/feature/shared/components/toast.component"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { saveBusinessInfo } from "../services/settings.service"
import type { ISettings } from "../services/settings.service"
import styles from "../styles/settings.style.module.css"

interface BusinessInfoFormProps {
    initialValues: Pick<ISettings, "businessName" | "businessAddress" | "phoneNumber" | "whatsappNumber" | "description">
    onUnsavedChange: (hasChanges: boolean) => void
}

export function BusinessInfoForm({ initialValues, onUnsavedChange }: BusinessInfoFormProps) {
    const [businessName, setBusinessName] = useState<string>(initialValues.businessName)
    const [businessAddress, setBusinessAddress] = useState<string>(initialValues.businessAddress)
    const [phoneNumber, setPhoneNumber] = useState<string>(initialValues.phoneNumber)
    const [whatsappNumber, setWhatsappNumber] = useState<string>(initialValues.whatsappNumber)
    const [description, setDescription] = useState<string>(initialValues.description)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { toast, showToast } = useToast()

    const hasChanges =
        businessName !== initialValues.businessName ||
        businessAddress !== initialValues.businessAddress ||
        phoneNumber !== initialValues.phoneNumber ||
        whatsappNumber !== initialValues.whatsappNumber ||
        description !== initialValues.description

    useEffect(() => {
        onUnsavedChange(hasChanges)
    }, [hasChanges, onUnsavedChange])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMessage("")
        setIsSaving(true)
        const ok = await saveBusinessInfo({ businessName, businessAddress, phoneNumber, whatsappNumber, description })
        setIsSaving(false)
        if (ok) {
            showToast("Información actualizada", "success")
        } else {
            setErrorMessage("No se pudo guardar. Intenta de nuevo.")
        }
    }

    return (
        <form className={styles.settingsForm} onSubmit={handleSubmit} data-testid="business-info-form">
            <Toast message={toast.message} type={toast.type} />
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="businessName">Nombre del negocio *</label>
                <input
                    id="businessName"
                    className={styles.formInput}
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    data-testid="input-business-name"
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="businessAddress">Dirección *</label>
                <input
                    id="businessAddress"
                    className={styles.formInput}
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    required
                    data-testid="input-business-address"
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="phoneNumber">Teléfono</label>
                <input
                    id="phoneNumber"
                    className={styles.formInput}
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    data-testid="input-phone-number"
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="whatsappNumber">WhatsApp *</label>
                <input
                    id="whatsappNumber"
                    className={styles.formInput}
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    required
                    data-testid="input-whatsapp-number"
                />
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="description">Descripción</label>
                <textarea
                    id="description"
                    className={styles.formTextarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    data-testid="input-description"
                />
            </div>
            {errorMessage !== "" && (
                <p className={styles.formError} role="alert" data-testid="business-info-error">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                className={styles.formButton}
                disabled={isSaving}
                data-testid="btn-save-business-info"
            >
                {isSaving ? "Guardando..." : "Guardar"}
            </button>
        </form>
    )
}

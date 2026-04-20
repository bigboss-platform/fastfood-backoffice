"use client"

import { useState, useEffect } from "react"
import { Toast } from "@/feature/shared/components/toast.component"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { saveDeliveryConfig } from "../services/settings.service"
import type { ISettings } from "../services/settings.service"
import styles from "../styles/settings.style.module.css"

interface DeliveryConfigFormProps {
    initialValues: Pick<ISettings, "deliveryEnabled" | "costPerKm" | "maxRadiusKm" | "latitude" | "longitude">
    onUnsavedChange: (hasChanges: boolean) => void
}

function validateLatitude(val: number): string {
    if (val < -90 || val > 90) return "Latitud debe estar entre -90 y 90"
    return ""
}

function validateLongitude(val: number): string {
    if (val < -180 || val > 180) return "Longitud debe estar entre -180 y 180"
    return ""
}

export function DeliveryConfigForm({ initialValues, onUnsavedChange }: DeliveryConfigFormProps) {
    const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(initialValues.deliveryEnabled)
    const [costPerKm, setCostPerKm] = useState<number>(initialValues.costPerKm)
    const [maxRadiusKm, setMaxRadiusKm] = useState<number>(initialValues.maxRadiusKm)
    const [latitude, setLatitude] = useState<number>(initialValues.latitude)
    const [longitude, setLongitude] = useState<number>(initialValues.longitude)
    const [latError, setLatError] = useState<string>("")
    const [lngError, setLngError] = useState<string>("")
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { toast, showToast } = useToast()

    const hasChanges =
        deliveryEnabled !== initialValues.deliveryEnabled ||
        costPerKm !== initialValues.costPerKm ||
        maxRadiusKm !== initialValues.maxRadiusKm ||
        latitude !== initialValues.latitude ||
        longitude !== initialValues.longitude

    useEffect(() => {
        onUnsavedChange(hasChanges)
    }, [hasChanges, onUnsavedChange])

    function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        const newLng = Number((-180 + x * 360).toFixed(6))
        const newLat = Number((90 - y * 180).toFixed(6))
        setLatitude(newLat)
        setLongitude(newLng)
        setLatError("")
        setLngError("")
    }

    function handleLatChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value)
        setLatitude(val)
        setLatError(validateLatitude(val))
    }

    function handleLngChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = Number(e.target.value)
        setLongitude(val)
        setLngError(validateLongitude(val))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const latErr = validateLatitude(latitude)
        const lngErr = validateLongitude(longitude)
        setLatError(latErr)
        setLngError(lngErr)
        const hasValidationErrors = Boolean(latErr) || Boolean(lngErr)
        if (hasValidationErrors) return
        setErrorMessage("")
        setIsSaving(true)
        const ok = await saveDeliveryConfig({ deliveryEnabled, costPerKm, maxRadiusKm, latitude, longitude })
        setIsSaving(false)
        if (ok) {
            showToast("Configuración de entrega actualizada", "success")
        } else {
            setErrorMessage("No se pudo guardar. Intenta de nuevo.")
        }
    }

    const pinLeft = ((longitude + 180) / 360) * 100
    const pinTop = ((90 - latitude) / 180) * 100

    return (
        <form className={styles.settingsForm} onSubmit={handleSubmit} data-testid="delivery-config-form">
            <Toast message={toast.message} type={toast.type} />
            <label className={styles.toggleLabel} htmlFor="deliveryEnabled">
                <span className={styles.toggleText}>Entrega a domicilio</span>
                <input
                    id="deliveryEnabled"
                    type="checkbox"
                    className={styles.toggleInput}
                    checked={deliveryEnabled}
                    onChange={(e) => setDeliveryEnabled(e.target.checked)}
                    data-testid="toggle-delivery-enabled"
                />
                <span className={styles.toggleTrack} aria-hidden="true" />
            </label>
            {deliveryEnabled && (
                <>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label className={styles.formLabel} htmlFor="costPerKm">Costo por km *</label>
                            <input
                                id="costPerKm"
                                className={styles.formInput}
                                type="number"
                                min={0}
                                step={0.01}
                                value={costPerKm}
                                onChange={(e) => setCostPerKm(Number(e.target.value))}
                                required
                                data-testid="input-cost-per-km"
                            />
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel} htmlFor="maxRadiusKm">Radio máximo (km) *</label>
                            <input
                                id="maxRadiusKm"
                                className={styles.formInput}
                                type="number"
                                min={0}
                                step={0.1}
                                value={maxRadiusKm}
                                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                                required
                                data-testid="input-max-radius-km"
                            />
                        </div>
                    </div>
                    <div
                        className={styles.mapPicker}
                        onClick={handleMapClick}
                        role="button"
                        tabIndex={0}
                        aria-label="Haz clic para establecer la ubicación del negocio"
                        data-testid="map-picker"
                    >
                        <span
                            className={styles.mapPin}
                            style={
                                {
                                    "--pin-left": `${pinLeft}%`,
                                    "--pin-top": `${pinTop}%`,
                                } as React.CSSProperties
                            }
                            aria-hidden="true"
                        >
                            &#9711;
                        </span>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formField}>
                            <label className={styles.formLabel} htmlFor="latitude">Latitud *</label>
                            <input
                                id="latitude"
                                className={styles.formInput}
                                type="number"
                                step={0.000001}
                                value={latitude}
                                onChange={handleLatChange}
                                required
                                data-testid="input-latitude"
                            />
                            {latError !== "" && (
                                <span className={styles.formFieldError} role="alert">{latError}</span>
                            )}
                        </div>
                        <div className={styles.formField}>
                            <label className={styles.formLabel} htmlFor="longitude">Longitud *</label>
                            <input
                                id="longitude"
                                className={styles.formInput}
                                type="number"
                                step={0.000001}
                                value={longitude}
                                onChange={handleLngChange}
                                required
                                data-testid="input-longitude"
                            />
                            {lngError !== "" && (
                                <span className={styles.formFieldError} role="alert">{lngError}</span>
                            )}
                        </div>
                    </div>
                </>
            )}
            {errorMessage !== "" && (
                <p className={styles.formError} role="alert" data-testid="delivery-config-error">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                className={styles.formButton}
                disabled={isSaving}
                data-testid="btn-save-delivery-config"
            >
                {isSaving ? "Guardando..." : "Guardar"}
            </button>
        </form>
    )
}

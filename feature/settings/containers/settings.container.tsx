"use client"

import { useState, useEffect, useCallback } from "react"
import { useSettings } from "../hooks/use-settings.hook"
import { BusinessInfoForm } from "../components/business-info-form.component"
import { DeliveryConfigForm } from "../components/delivery-config-form.component"
import { PaymentInstructionsForm } from "../components/payment-instructions-form.component"
import { SocialLinksForm } from "../components/social-links-form.component"
import { ThemeEditor } from "../components/theme-editor.component"
import styles from "../styles/settings.style.module.css"

type SettingsTab = "negocio" | "entrega" | "pagos" | "redes" | "apariencia"

const TABS: Array<{ id: SettingsTab; label: string }> = [
    { id: "negocio", label: "Negocio" },
    { id: "entrega", label: "Entrega" },
    { id: "pagos", label: "Pagos" },
    { id: "redes", label: "Redes sociales" },
    { id: "apariencia", label: "Apariencia" },
]

type DirtySections = Record<SettingsTab, boolean>

const EMPTY_DIRTY_SECTIONS: DirtySections = {
    negocio: false,
    entrega: false,
    pagos: false,
    redes: false,
    apariencia: false,
}

export function SettingsContainer() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("negocio")
    const [dirtySections, setDirtySections] = useState<DirtySections>(EMPTY_DIRTY_SECTIONS)
    const { settings, theme, isLoading } = useSettings()

    const hasUnsavedChanges = Object.values(dirtySections).some(Boolean)

    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (!hasUnsavedChanges) return
            e.preventDefault()
            e.returnValue = ""
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [hasUnsavedChanges])

    function handleTabChange(tab: SettingsTab) {
        const activeTabIsDirty = dirtySections[activeTab]
        if (activeTabIsDirty) {
            const confirmed = window.confirm("Tienes cambios sin guardar en esta sección. ¿Deseas continuar?")
            if (!confirmed) return
            setDirtySections((prev) => ({ ...prev, [activeTab]: false }))
        }
        setActiveTab(tab)
    }

    const handleNegocioUnsaved = useCallback((v: boolean) => {
        setDirtySections((prev) => ({ ...prev, negocio: v }))
    }, [])
    const handleEntregaUnsaved = useCallback((v: boolean) => {
        setDirtySections((prev) => ({ ...prev, entrega: v }))
    }, [])
    const handlePagosUnsaved = useCallback((v: boolean) => {
        setDirtySections((prev) => ({ ...prev, pagos: v }))
    }, [])
    const handleRedesUnsaved = useCallback((v: boolean) => {
        setDirtySections((prev) => ({ ...prev, redes: v }))
    }, [])
    const handleAparienciaUnsaved = useCallback((v: boolean) => {
        setDirtySections((prev) => ({ ...prev, apariencia: v }))
    }, [])

    if (isLoading) {
        return (
            <section className={styles.settings} data-testid="settings-container">
                <h2 className={styles.settingsTitle}>Ajustes</h2>
                <div className={styles.settingsLoading} aria-busy="true">
                    <span className={styles.settingsLoadingSkeleton} />
                    <span className={styles.settingsLoadingSkeleton} />
                    <span className={styles.settingsLoadingSkeleton} />
                </div>
            </section>
        )
    }

    return (
        <section className={styles.settings} data-testid="settings-container">
            <h2 className={styles.settingsTitle}>Ajustes</h2>
            {hasUnsavedChanges && (
                <div className={styles.unsavedWarning} role="alert" data-testid="unsaved-changes-warning">
                    Tienes cambios sin guardar
                </div>
            )}
            <nav className={styles.settingsTabs} aria-label="Secciones de ajustes">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id
                    const tabClassName = isActive
                        ? `${styles.settingsTab} ${styles.settingsTabActive}`
                        : styles.settingsTab
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            className={tabClassName}
                            onClick={() => handleTabChange(tab.id)}
                            data-testid={`tab-${tab.id}`}
                            aria-selected={isActive}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </nav>
            <div className={styles.settingsContent}>
                <div className={activeTab === "negocio" ? undefined : styles.settingsSectionHidden}>
                    <BusinessInfoForm
                        initialValues={{
                            businessName: settings.businessName,
                            businessAddress: settings.businessAddress,
                            phoneNumber: settings.phoneNumber,
                            whatsappNumber: settings.whatsappNumber,
                            description: settings.description,
                        }}
                        onUnsavedChange={handleNegocioUnsaved}
                    />
                </div>
                <div className={activeTab === "entrega" ? undefined : styles.settingsSectionHidden}>
                    <DeliveryConfigForm
                        initialValues={{
                            deliveryEnabled: settings.deliveryEnabled,
                            costPerKm: settings.costPerKm,
                            maxRadiusKm: settings.maxRadiusKm,
                            latitude: settings.latitude,
                            longitude: settings.longitude,
                        }}
                        onUnsavedChange={handleEntregaUnsaved}
                    />
                </div>
                <div className={activeTab === "pagos" ? undefined : styles.settingsSectionHidden}>
                    <PaymentInstructionsForm
                        initialPaymentInstructions={settings.paymentInstructions}
                        onUnsavedChange={handlePagosUnsaved}
                    />
                </div>
                <div className={activeTab === "redes" ? undefined : styles.settingsSectionHidden}>
                    <SocialLinksForm
                        initialValues={{
                            instagramUrl: settings.instagramUrl,
                            facebookUrl: settings.facebookUrl,
                            tiktokUrl: settings.tiktokUrl,
                        }}
                        onUnsavedChange={handleRedesUnsaved}
                    />
                </div>
                <div className={activeTab === "apariencia" ? undefined : styles.settingsSectionHidden}>
                    <ThemeEditor
                        initialTheme={theme}
                        onUnsavedChange={handleAparienciaUnsaved}
                    />
                </div>
            </div>
        </section>
    )
}

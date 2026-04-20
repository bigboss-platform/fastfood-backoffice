"use client"

import { useState, useEffect } from "react"
import { Toast } from "@/feature/shared/components/toast.component"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { saveTheme } from "../services/settings.service"
import type { IThemeSettings } from "../services/settings.service"
import { ThemePreview } from "./theme-preview.component"
import styles from "../styles/theme-editor.style.module.css"
import settingsStyles from "../styles/settings.style.module.css"

interface ThemeEditorProps {
    initialTheme: IThemeSettings
    onUnsavedChange: (hasChanges: boolean) => void
}

const COLOR_FIELDS: Array<{ key: keyof IThemeSettings; label: string }> = [
    { key: "colorPrimary", label: "Color primario" },
    { key: "colorPrimaryForeground", label: "Texto sobre primario" },
    { key: "colorBackground", label: "Fondo" },
    { key: "colorSurface", label: "Superficie" },
    { key: "colorTextPrimary", label: "Texto principal" },
    { key: "colorTextSecondary", label: "Texto secundario" },
    { key: "colorBorder", label: "Bordes" },
]

export function ThemeEditor({ initialTheme, onUnsavedChange }: ThemeEditorProps) {
    const [theme, setTheme] = useState<IThemeSettings>(initialTheme)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { toast, showToast } = useToast()

    const hasChanges =
        theme.colorPrimary !== initialTheme.colorPrimary ||
        theme.colorPrimaryForeground !== initialTheme.colorPrimaryForeground ||
        theme.colorBackground !== initialTheme.colorBackground ||
        theme.colorSurface !== initialTheme.colorSurface ||
        theme.colorTextPrimary !== initialTheme.colorTextPrimary ||
        theme.colorTextSecondary !== initialTheme.colorTextSecondary ||
        theme.colorBorder !== initialTheme.colorBorder ||
        theme.fontUrl !== initialTheme.fontUrl ||
        theme.fontName !== initialTheme.fontName

    useEffect(() => {
        onUnsavedChange(hasChanges)
    }, [hasChanges, onUnsavedChange])

    function updateField(key: keyof IThemeSettings, value: string) {
        setTheme((prev) => ({ ...prev, [key]: value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMessage("")
        setIsSaving(true)
        const ok = await saveTheme(theme)
        setIsSaving(false)
        if (ok) {
            showToast("Apariencia actualizada", "success")
        } else {
            setErrorMessage("No se pudo guardar. Intenta de nuevo.")
        }
    }

    return (
        <div className={styles.themeEditorLayout}>
            <form className={styles.themeEditorForm} onSubmit={handleSubmit} data-testid="theme-editor-form">
                <Toast message={toast.message} type={toast.type} />
                <div className={styles.colorGrid}>
                    {COLOR_FIELDS.map(({ key, label }) => (
                        <div key={key} className={styles.colorField}>
                            <label className={styles.colorLabel} htmlFor={key}>{label}</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    id={key}
                                    type="color"
                                    className={styles.colorSwatch}
                                    value={theme[key] || "#000000"}
                                    onChange={(e) => updateField(key, e.target.value)}
                                    data-testid={`color-${key}`}
                                />
                                <input
                                    type="text"
                                    className={styles.colorText}
                                    value={theme[key]}
                                    onChange={(e) => updateField(key, e.target.value)}
                                    placeholder="#000000"
                                    data-testid={`color-text-${key}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.fontSection}>
                    <div className={styles.colorField}>
                        <label className={styles.colorLabel} htmlFor="fontUrl">URL de fuente (Google Fonts)</label>
                        <input
                            id="fontUrl"
                            className={settingsStyles.formInput}
                            type="url"
                            value={theme.fontUrl}
                            onChange={(e) => updateField("fontUrl", e.target.value)}
                            placeholder="https://fonts.googleapis.com/css2?family=Inter"
                            data-testid="input-font-url"
                        />
                    </div>
                    <div className={styles.colorField}>
                        <label className={styles.colorLabel} htmlFor="fontName">Nombre de fuente</label>
                        <input
                            id="fontName"
                            className={settingsStyles.formInput}
                            type="text"
                            value={theme.fontName}
                            onChange={(e) => updateField("fontName", e.target.value)}
                            placeholder="Inter"
                            data-testid="input-font-name"
                        />
                    </div>
                </div>
                {errorMessage !== "" && (
                    <p className={settingsStyles.formError} role="alert" data-testid="theme-editor-error">
                        {errorMessage}
                    </p>
                )}
                <button
                    type="submit"
                    className={settingsStyles.formButton}
                    disabled={isSaving}
                    data-testid="btn-save-theme"
                >
                    {isSaving ? "Guardando..." : "Guardar"}
                </button>
            </form>
            <ThemePreview theme={theme} />
        </div>
    )
}

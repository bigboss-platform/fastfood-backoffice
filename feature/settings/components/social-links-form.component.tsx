"use client"

import { useState, useEffect } from "react"
import { Toast } from "@/feature/shared/components/toast.component"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import { saveSocialLinks } from "../services/settings.service"
import type { ISettings } from "../services/settings.service"
import styles from "../styles/settings.style.module.css"

interface SocialLinksFormProps {
    initialValues: Pick<ISettings, "instagramUrl" | "facebookUrl" | "tiktokUrl">
    onUnsavedChange: (hasChanges: boolean) => void
}

function validateUrl(url: string): string {
    if (url === "") return ""
    const startsWithHttps = url.startsWith("https://")
    if (!startsWithHttps) return "La URL debe comenzar con https://"
    return ""
}

export function SocialLinksForm({ initialValues, onUnsavedChange }: SocialLinksFormProps) {
    const [instagramUrl, setInstagramUrl] = useState<string>(initialValues.instagramUrl)
    const [facebookUrl, setFacebookUrl] = useState<string>(initialValues.facebookUrl)
    const [tiktokUrl, setTiktokUrl] = useState<string>(initialValues.tiktokUrl)
    const [instagramError, setInstagramError] = useState<string>("")
    const [facebookError, setFacebookError] = useState<string>("")
    const [tiktokError, setTiktokError] = useState<string>("")
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const { toast, showToast } = useToast()

    const hasChanges =
        instagramUrl !== initialValues.instagramUrl ||
        facebookUrl !== initialValues.facebookUrl ||
        tiktokUrl !== initialValues.tiktokUrl

    useEffect(() => {
        onUnsavedChange(hasChanges)
    }, [hasChanges, onUnsavedChange])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const igErr = validateUrl(instagramUrl)
        const fbErr = validateUrl(facebookUrl)
        const ttErr = validateUrl(tiktokUrl)
        setInstagramError(igErr)
        setFacebookError(fbErr)
        setTiktokError(ttErr)
        const hasValidationErrors = Boolean(igErr) || Boolean(fbErr) || Boolean(ttErr)
        if (hasValidationErrors) return
        setErrorMessage("")
        setIsSaving(true)
        const ok = await saveSocialLinks({ instagramUrl, facebookUrl, tiktokUrl })
        setIsSaving(false)
        if (ok) {
            showToast("Redes sociales actualizadas", "success")
        } else {
            setErrorMessage("No se pudo guardar. Intenta de nuevo.")
        }
    }

    return (
        <form className={styles.settingsForm} onSubmit={handleSubmit} data-testid="social-links-form">
            <Toast message={toast.message} type={toast.type} />
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="instagramUrl">Instagram</label>
                <input
                    id="instagramUrl"
                    className={styles.formInput}
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => {
                        setInstagramUrl(e.target.value)
                        setInstagramError(validateUrl(e.target.value))
                    }}
                    placeholder="https://instagram.com/tunegocio"
                    data-testid="input-instagram-url"
                />
                {instagramError !== "" && (
                    <span className={styles.formFieldError} role="alert">{instagramError}</span>
                )}
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="facebookUrl">Facebook</label>
                <input
                    id="facebookUrl"
                    className={styles.formInput}
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => {
                        setFacebookUrl(e.target.value)
                        setFacebookError(validateUrl(e.target.value))
                    }}
                    placeholder="https://facebook.com/tunegocio"
                    data-testid="input-facebook-url"
                />
                {facebookError !== "" && (
                    <span className={styles.formFieldError} role="alert">{facebookError}</span>
                )}
            </div>
            <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="tiktokUrl">TikTok</label>
                <input
                    id="tiktokUrl"
                    className={styles.formInput}
                    type="url"
                    value={tiktokUrl}
                    onChange={(e) => {
                        setTiktokUrl(e.target.value)
                        setTiktokError(validateUrl(e.target.value))
                    }}
                    placeholder="https://tiktok.com/@tunegocio"
                    data-testid="input-tiktok-url"
                />
                {tiktokError !== "" && (
                    <span className={styles.formFieldError} role="alert">{tiktokError}</span>
                )}
            </div>
            {errorMessage !== "" && (
                <p className={styles.formError} role="alert" data-testid="social-links-error">
                    {errorMessage}
                </p>
            )}
            <button
                type="submit"
                className={styles.formButton}
                disabled={isSaving}
                data-testid="btn-save-social-links"
            >
                {isSaving ? "Guardando..." : "Guardar"}
            </button>
        </form>
    )
}

"use client"

import { useState } from "react"
import { MENU_PHOTO_MAX_BYTES, MENU_PHOTO_ACCEPTED_TYPES } from "../constants/menu.constant"
import styles from "../styles/item-form.style.module.css"

interface PhotoUploadProps {
    currentPhotoUrl: string
    onFileSelect: (file: File | undefined) => void
}

export function PhotoUpload({ currentPhotoUrl, onFileSelect }: PhotoUploadProps) {
    const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file === undefined) return

        const isValidType = MENU_PHOTO_ACCEPTED_TYPES.includes(file.type)
        if (!isValidType) {
            setError("Solo se permiten imágenes JPG o PNG.")
            onFileSelect(undefined)
            return
        }

        const isValidSize = file.size <= MENU_PHOTO_MAX_BYTES
        if (!isValidSize) {
            setError("La imagen no puede superar 2 MB.")
            onFileSelect(undefined)
            return
        }

        setError("")
        setPreviewUrl(URL.createObjectURL(file))
        onFileSelect(file)
    }

    const hasPreview = previewUrl !== ""
    const hasError = error !== ""

    return (
        <div className={styles.photoUpload}>
            {hasPreview && (
                <img
                    src={previewUrl}
                    alt="Vista previa"
                    className={styles.photoPreview}
                    data-testid="photo-preview"
                />
            )}
            <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                className={styles.photoInput}
                data-testid="photo-input"
            />
            {hasError && (
                <span className={styles.fieldError} data-testid="photo-error">
                    {error}
                </span>
            )}
        </div>
    )
}

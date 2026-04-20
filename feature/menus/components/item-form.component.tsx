"use client"

import { useState } from "react"
import type { IMenuItem } from "../interfaces/menu-item.interface"
import type { IItemFormPayload } from "../hooks/use-menu-manager.hook"
import { PhotoUpload } from "./photo-upload.component"
import styles from "../styles/item-form.style.module.css"

interface ItemFormProps {
    item: IMenuItem
    onSave: (payload: IItemFormPayload) => Promise<void>
    onCancel: () => void
}

export function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
    const [name, setName] = useState(item.name)
    const [description, setDescription] = useState(item.description)
    const [priceInput, setPriceInput] = useState(item.price > 0 ? String(item.price) : "")
    const [isAvailable, setIsAvailable] = useState(item.isAvailable)
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined)
    const [nameError, setNameError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const validate = (): boolean => {
        let valid = true
        if (name.trim() === "") {
            setNameError("El nombre es obligatorio.")
            valid = false
        } else {
            setNameError("")
        }
        const priceNum = parseFloat(priceInput)
        if (isNaN(priceNum) || priceNum <= 0) {
            setPriceError("El precio debe ser mayor a 0.")
            valid = false
        } else {
            setPriceError("")
        }
        return valid
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setIsSaving(true)
        await onSave({
            name: name.trim(),
            description: description.trim(),
            price: parseFloat(priceInput),
            isAvailable,
            photoFile,
        })
        setIsSaving(false)
    }

    return (
        <form className={styles.itemForm} onSubmit={handleSubmit} data-testid="item-form">
            <div className={styles.formField}>
                <label className={styles.fieldLabel} htmlFor="item-name">
                    Nombre *
                </label>
                <input
                    id="item-name"
                    className={`${styles.fieldInput} ${nameError !== "" ? styles.fieldInputError : ""}`}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="item-name-input"
                />
                {nameError !== "" && (
                    <span className={styles.fieldError} data-testid="item-name-error">
                        {nameError}
                    </span>
                )}
            </div>

            <div className={styles.formField}>
                <label className={styles.fieldLabel} htmlFor="item-description">
                    Descripción
                </label>
                <textarea
                    id="item-description"
                    className={styles.fieldTextarea}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="item-description-input"
                    rows={3}
                />
            </div>

            <div className={styles.formField}>
                <label className={styles.fieldLabel} htmlFor="item-price">
                    Precio *
                </label>
                <input
                    id="item-price"
                    className={`${styles.fieldInput} ${priceError !== "" ? styles.fieldInputError : ""}`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    data-testid="item-price-input"
                />
                {priceError !== "" && (
                    <span className={styles.fieldError} data-testid="item-price-error">
                        {priceError}
                    </span>
                )}
            </div>

            <div className={styles.formField}>
                <label className={styles.fieldLabel}>Foto</label>
                <PhotoUpload
                    currentPhotoUrl={item.photoUrl}
                    onFileSelect={setPhotoFile}
                />
            </div>

            <div className={styles.formFieldRow}>
                <label className={styles.toggleLabel} htmlFor="item-available">
                    <input
                        id="item-available"
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        data-testid="item-available-toggle"
                    />
                    <span className={styles.toggleSlider} />
                    <span className={styles.toggleText}>Disponible</span>
                </label>
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={onCancel}
                    data-testid="item-form-cancel"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving}
                    data-testid="item-form-save"
                >
                    {isSaving ? "Guardando..." : "Guardar"}
                </button>
            </div>
        </form>
    )
}

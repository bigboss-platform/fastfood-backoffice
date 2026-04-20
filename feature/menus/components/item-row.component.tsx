"use client"

import type { IMenuItem } from "../interfaces/menu-item.interface"
import styles from "../styles/item-row.style.module.css"

interface ItemRowProps {
    item: IMenuItem
    isPendingDelete: boolean
    onEdit: () => void
    onRequestDelete: () => void
    onCancelDelete: () => void
    onConfirmDelete: () => Promise<void>
    onToggleAvailable: () => void
    onDragStart: () => void
    onDrop: () => void
}

export function ItemRow({
    item,
    isPendingDelete,
    onEdit,
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
    onToggleAvailable,
    onDragStart,
    onDrop,
}: ItemRowProps) {
    const hasPhoto = item.photoUrl !== ""

    return (
        <div
            className={`${styles.itemRow} ${!item.isAvailable ? styles.unavailable : ""}`}
            data-testid={`menu-item-${item.id}`}
            draggable
            onDragStart={onDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <span className={styles.dragHandle} aria-hidden="true" title="Arrastrar">
                ⠿
            </span>

            {hasPhoto ? (
                <img
                    src={item.photoUrl}
                    alt={item.name}
                    className={styles.itemPhoto}
                    data-testid={`item-photo-${item.id}`}
                />
            ) : (
                <div className={styles.itemPhotoPlaceholder} aria-hidden="true" />
            )}

            <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                {item.description !== "" && (
                    <span className={styles.itemDescription}>{item.description}</span>
                )}
                <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
            </div>

            <div className={styles.itemActions}>
                <label className={styles.toggleLabel} title={item.isAvailable ? "Disponible" : "No disponible"}>
                    <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={item.isAvailable}
                        onChange={onToggleAvailable}
                        data-testid={`item-available-${item.id}`}
                    />
                    <span className={styles.toggleSlider} />
                </label>

                <button
                    type="button"
                    className={styles.editButton}
                    onClick={onEdit}
                    data-testid={`item-edit-${item.id}`}
                >
                    Editar
                </button>

                {!isPendingDelete ? (
                    <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={onRequestDelete}
                        data-testid={`item-delete-${item.id}`}
                    >
                        Eliminar
                    </button>
                ) : (
                    <div
                        className={styles.deleteConfirm}
                        data-testid={`item-delete-confirm-${item.id}`}
                    >
                        <span className={styles.deleteConfirmText}>¿Eliminar?</span>
                        <button
                            type="button"
                            className={styles.confirmYesButton}
                            onClick={onConfirmDelete}
                            data-testid={`item-delete-yes-${item.id}`}
                        >
                            Sí
                        </button>
                        <button
                            type="button"
                            className={styles.confirmNoButton}
                            onClick={onCancelDelete}
                            data-testid={`item-delete-no-${item.id}`}
                        >
                            No
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

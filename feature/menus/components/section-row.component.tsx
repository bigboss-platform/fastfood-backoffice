"use client"

import { useState } from "react"
import type { IMenuSection } from "../interfaces/menu-section.interface"
import type { IMenuItem } from "../interfaces/menu-item.interface"
import type { IItemFormPayload } from "../hooks/use-menu-manager.hook"
import { ItemRow } from "./item-row.component"
import { ItemForm } from "./item-form.component"
import styles from "../styles/menu-manager.style.module.css"

interface SectionRowProps {
    section: IMenuSection
    isExpanded: boolean
    isEditing: boolean
    isPendingDelete: boolean
    pendingDeleteItemId: string
    showItemForm: boolean
    editingItem: IMenuItem
    onToggle: () => void
    onStartEdit: () => void
    onSaveEdit: (name: string) => Promise<void>
    onCancelEdit: () => void
    onToggleActive: (isActive: boolean) => Promise<void>
    onRequestDelete: () => void
    onCancelDelete: () => void
    onConfirmDelete: () => Promise<void>
    onAddItem: () => void
    onStartEditItem: (item: IMenuItem) => void
    onCloseItemForm: () => void
    onSaveItem: (payload: IItemFormPayload) => Promise<void>
    onToggleItemAvailable: (item: IMenuItem) => void
    onRequestDeleteItem: (id: string) => void
    onCancelDeleteItem: () => void
    onConfirmDeleteItem: () => Promise<void>
    onDragStart: () => void
    onDrop: () => void
    onItemDragStart: (itemId: string) => void
    onItemDrop: (targetItemId: string) => void
}

export function SectionRow({
    section,
    isExpanded,
    isEditing,
    isPendingDelete,
    pendingDeleteItemId,
    showItemForm,
    editingItem,
    onToggle,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onToggleActive,
    onRequestDelete,
    onCancelDelete,
    onConfirmDelete,
    onAddItem,
    onStartEditItem,
    onCloseItemForm,
    onSaveItem,
    onToggleItemAvailable,
    onRequestDeleteItem,
    onCancelDeleteItem,
    onConfirmDeleteItem,
    onDragStart,
    onDrop,
    onItemDragStart,
    onItemDrop,
}: SectionRowProps) {
    const [editName, setEditName] = useState(section.name)

    const itemCount = section.items.length
    const sortedItems = [...section.items].sort((a, b) => a.sortOrder - b.sortOrder)

    const handleBlur = async () => {
        await onSaveEdit(editName)
    }

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") await onSaveEdit(editName)
        if (e.key === "Escape") onCancelEdit()
    }

    return (
        <div
            className={styles.sectionRow}
            data-testid={`section-${section.id}`}
            draggable
            onDragStart={onDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
        >
            <div className={styles.sectionHeader}>
                <span className={styles.dragHandle} aria-hidden="true" title="Arrastrar">
                    ⠿
                </span>

                <button
                    type="button"
                    className={styles.collapseButton}
                    onClick={onToggle}
                    data-testid={`section-toggle-${section.id}`}
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? "▾" : "▸"}
                </button>

                {isEditing ? (
                    <input
                        className={styles.sectionNameInput}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        data-testid={`section-name-input-${section.id}`}
                    />
                ) : (
                    <span className={styles.sectionName}>{section.name}</span>
                )}

                <span className={styles.sectionItemCount}>
                    {itemCount} producto{itemCount !== 1 ? "s" : ""}
                </span>

                <div className={styles.sectionActions}>
                    {!isEditing && (
                        <button
                            type="button"
                            className={styles.editSectionButton}
                            onClick={onStartEdit}
                            data-testid={`section-edit-${section.id}`}
                        >
                            Editar nombre
                        </button>
                    )}

                    <label
                        className={styles.toggleLabel}
                        title={section.isActive ? "Activa" : "Inactiva"}
                    >
                        <input
                            type="checkbox"
                            className={styles.toggleInput}
                            checked={section.isActive}
                            onChange={() => onToggleActive(!section.isActive)}
                            data-testid={`section-active-${section.id}`}
                        />
                        <span className={styles.toggleSlider} />
                    </label>

                    {!isPendingDelete ? (
                        <button
                            type="button"
                            className={styles.deleteSectionButton}
                            onClick={onRequestDelete}
                            data-testid={`section-delete-${section.id}`}
                        >
                            Eliminar
                        </button>
                    ) : (
                        <div
                            className={styles.deleteConfirm}
                            data-testid={`section-delete-confirm-${section.id}`}
                        >
                            <span className={styles.deleteWarning}>
                                {itemCount > 0
                                    ? `Esta sección tiene ${itemCount} producto${itemCount !== 1 ? "s" : ""}. ¿Eliminar de todas formas?`
                                    : "¿Eliminar esta sección?"}
                            </span>
                            <button
                                type="button"
                                className={styles.confirmYesButton}
                                onClick={onConfirmDelete}
                                data-testid={`section-delete-yes-${section.id}`}
                            >
                                Sí
                            </button>
                            <button
                                type="button"
                                className={styles.confirmNoButton}
                                onClick={onCancelDelete}
                                data-testid={`section-delete-no-${section.id}`}
                            >
                                No
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className={styles.sectionItems}>
                    {sortedItems.map((item) => (
                        <div key={item.id}>
                            <ItemRow
                                item={item}
                                isPendingDelete={pendingDeleteItemId === item.id}
                                onEdit={() => onStartEditItem(item)}
                                onRequestDelete={() => onRequestDeleteItem(item.id)}
                                onCancelDelete={onCancelDeleteItem}
                                onConfirmDelete={onConfirmDeleteItem}
                                onToggleAvailable={() => onToggleItemAvailable(item)}
                                onDragStart={() => onItemDragStart(item.id)}
                                onDrop={() => onItemDrop(item.id)}
                            />
                            {showItemForm && editingItem.id === item.id && (
                                <ItemForm
                                    item={editingItem}
                                    onSave={onSaveItem}
                                    onCancel={onCloseItemForm}
                                />
                            )}
                        </div>
                    ))}

                    {showItemForm && editingItem.id === "" && (
                        <ItemForm
                            item={editingItem}
                            onSave={onSaveItem}
                            onCancel={onCloseItemForm}
                        />
                    )}

                    <button
                        type="button"
                        className={styles.addItemButton}
                        onClick={onAddItem}
                        data-testid={`section-add-item-${section.id}`}
                    >
                        + Agregar producto
                    </button>
                </div>
            )}
        </div>
    )
}

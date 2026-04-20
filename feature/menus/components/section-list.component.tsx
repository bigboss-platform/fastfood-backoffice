"use client"

import type { IUseMenuManager } from "../hooks/use-menu-manager.hook"
import { SectionRow } from "./section-row.component"
import styles from "../styles/menu-manager.style.module.css"

interface SectionListProps {
    hook: IUseMenuManager
}

export function SectionList({ hook }: SectionListProps) {
    const {
        sections,
        expandedSections,
        editingSectionId,
        pendingDeleteSectionId,
        pendingDeleteItemId,
        activeSectionId,
        editingItem,
        showItemForm,
        toggleSection,
        startEditSection,
        saveEditSection,
        cancelEditSection,
        toggleSectionActive,
        requestDeleteSection,
        cancelDeleteSection,
        confirmDeleteSection,
        startAddItem,
        startEditItem,
        closeItemForm,
        saveItem,
        toggleItemAvailable,
        requestDeleteItem,
        cancelDeleteItem,
        confirmDeleteItem,
        onSectionDragStart,
        onSectionDrop,
        onItemDragStart,
        onItemDrop,
    } = hook

    if (sections.length === 0) {
        return (
            <p className={styles.emptyState} data-testid="menu-empty-state">
                No hay secciones todavía. Crea una para empezar.
            </p>
        )
    }

    return (
        <div className={styles.sectionList}>
            {sections.map((section) => {
                const isActiveSectionForForm = activeSectionId === section.id
                return (
                    <SectionRow
                        key={section.id}
                        section={section}
                        isExpanded={expandedSections[section.id] ?? true}
                        isEditing={editingSectionId === section.id}
                        isPendingDelete={pendingDeleteSectionId === section.id}
                        pendingDeleteItemId={pendingDeleteItemId}
                        showItemForm={showItemForm && isActiveSectionForForm}
                        editingItem={editingItem}
                        onToggle={() => toggleSection(section.id)}
                        onStartEdit={() => startEditSection(section.id)}
                        onSaveEdit={(name) => saveEditSection(section.id, name)}
                        onCancelEdit={cancelEditSection}
                        onToggleActive={(isActive) => toggleSectionActive(section.id, isActive)}
                        onRequestDelete={() => requestDeleteSection(section.id)}
                        onCancelDelete={cancelDeleteSection}
                        onConfirmDelete={confirmDeleteSection}
                        onAddItem={() => startAddItem(section.id)}
                        onStartEditItem={startEditItem}
                        onCloseItemForm={closeItemForm}
                        onSaveItem={saveItem}
                        onToggleItemAvailable={toggleItemAvailable}
                        onRequestDeleteItem={requestDeleteItem}
                        onCancelDeleteItem={cancelDeleteItem}
                        onConfirmDeleteItem={confirmDeleteItem}
                        onDragStart={() => onSectionDragStart(section.id)}
                        onDrop={() => onSectionDrop(section.id)}
                        onItemDragStart={(itemId) => onItemDragStart(itemId, section.id)}
                        onItemDrop={(targetItemId) => onItemDrop(targetItemId, section.id)}
                    />
                )
            })}
        </div>
    )
}

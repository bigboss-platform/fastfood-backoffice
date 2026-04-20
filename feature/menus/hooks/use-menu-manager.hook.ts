"use client"

import { useState, useCallback, useEffect } from "react"
import {
    fetchMenu,
    createSection,
    updateSection,
    deleteSection,
    createItem,
    updateItem,
    deleteItem,
    uploadItemPhoto,
} from "../services/menu.service"
import type { IMenuSection } from "../interfaces/menu-section.interface"
import type { IMenuItem } from "../interfaces/menu-item.interface"
import { EMPTY_MENU_ITEM } from "../constants/menu.constant"
import { useToast } from "@/feature/shared/hooks/use-toast.hook"
import type { IToast } from "@/feature/shared/hooks/use-toast.hook"

export interface IItemFormPayload {
    name: string
    description: string
    price: number
    isAvailable: boolean
    photoFile: File | undefined
}

export interface IUseMenuManager {
    sections: IMenuSection[]
    isLoading: boolean
    toast: IToast
    expandedSections: Record<string, boolean>
    editingSectionId: string
    pendingDeleteSectionId: string
    pendingDeleteItemId: string
    activeSectionId: string
    editingItem: IMenuItem
    showItemForm: boolean
    draggedSectionId: string
    draggedItemId: string
    toggleSection: (id: string) => void
    startEditSection: (id: string) => void
    cancelEditSection: () => void
    saveEditSection: (id: string, name: string) => Promise<void>
    toggleSectionActive: (id: string, isActive: boolean) => Promise<void>
    submitNewSection: (name: string) => Promise<void>
    requestDeleteSection: (id: string) => void
    cancelDeleteSection: () => void
    confirmDeleteSection: () => Promise<void>
    startAddItem: (sectionId: string) => void
    startEditItem: (item: IMenuItem) => void
    closeItemForm: () => void
    saveItem: (payload: IItemFormPayload) => Promise<void>
    toggleItemAvailable: (item: IMenuItem) => Promise<void>
    requestDeleteItem: (id: string) => void
    cancelDeleteItem: () => void
    confirmDeleteItem: () => Promise<void>
    onSectionDragStart: (id: string) => void
    onSectionDrop: (targetId: string) => Promise<void>
    onItemDragStart: (id: string, sectionId: string) => void
    onItemDrop: (targetId: string, targetSectionId: string) => Promise<void>
}

export function useMenuManager(): IUseMenuManager {
    const [sections, setSections] = useState<IMenuSection[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
    const [editingSectionId, setEditingSectionId] = useState("")
    const [pendingDeleteSectionId, setPendingDeleteSectionId] = useState("")
    const [pendingDeleteItemId, setPendingDeleteItemId] = useState("")
    const [activeSectionId, setActiveSectionId] = useState("")
    const [editingItem, setEditingItem] = useState<IMenuItem>(EMPTY_MENU_ITEM)
    const [showItemForm, setShowItemForm] = useState(false)
    const [draggedSectionId, setDraggedSectionId] = useState("")
    const [draggedItemId, setDraggedItemId] = useState("")
    const [draggedItemSectionId, setDraggedItemSectionId] = useState("")
    const { toast, showToast } = useToast()

    const loadMenu = useCallback(async () => {
        setIsLoading(true)
        const data = await fetchMenu()
        const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder)
        setSections(sorted)
        setExpandedSections((prev) => {
            const next: Record<string, boolean> = {}
            for (const s of sorted) {
                next[s.id] = prev[s.id] ?? true
            }
            return next
        })
        setIsLoading(false)
    }, [])

    useEffect(() => {
        loadMenu()
    }, [loadMenu])

    const toggleSection = useCallback((id: string) => {
        setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
    }, [])

    const startEditSection = useCallback((id: string) => {
        setEditingSectionId(id)
    }, [])

    const cancelEditSection = useCallback(() => {
        setEditingSectionId("")
    }, [])

    const saveEditSection = useCallback(
        async (id: string, name: string) => {
            const trimmed = name.trim()
            if (trimmed === "") {
                setEditingSectionId("")
                return
            }
            const updated = await updateSection(id, { name: trimmed })
            if (updated.id === "") {
                showToast("No se pudo actualizar la sección.", "error")
                return
            }
            setSections((prev) => prev.map((s) => (s.id === id ? { ...s, name: updated.name } : s)))
            setEditingSectionId("")
        },
        [showToast]
    )

    const toggleSectionActive = useCallback(
        async (id: string, isActive: boolean) => {
            setSections((prev) => prev.map((s) => (s.id === id ? { ...s, isActive } : s)))
            const updated = await updateSection(id, { isActive })
            if (updated.id === "") {
                setSections((prev) =>
                    prev.map((s) => (s.id === id ? { ...s, isActive: !isActive } : s))
                )
                showToast("No se pudo actualizar la sección.", "error")
            }
        },
        [showToast]
    )

    const submitNewSection = useCallback(
        async (name: string) => {
            const trimmed = name.trim()
            if (trimmed === "") return
            const created = await createSection(trimmed)
            if (created.id === "") {
                showToast("No se pudo crear la sección.", "error")
                return
            }
            setSections((prev) => [...prev, created])
            setExpandedSections((prev) => ({ ...prev, [created.id]: true }))
            showToast("Sección creada.", "success")
        },
        [showToast]
    )

    const requestDeleteSection = useCallback((id: string) => {
        setPendingDeleteSectionId(id)
    }, [])

    const cancelDeleteSection = useCallback(() => {
        setPendingDeleteSectionId("")
    }, [])

    const confirmDeleteSection = useCallback(async () => {
        const id = pendingDeleteSectionId
        if (id === "") return
        const ok = await deleteSection(id)
        if (!ok) {
            showToast("No se pudo eliminar la sección.", "error")
            return
        }
        setSections((prev) => prev.filter((s) => s.id !== id))
        setPendingDeleteSectionId("")
        showToast("Sección eliminada.", "success")
    }, [pendingDeleteSectionId, showToast])

    const closeItemForm = useCallback(() => {
        setShowItemForm(false)
        setEditingItem(EMPTY_MENU_ITEM)
        setActiveSectionId("")
    }, [])

    const startAddItem = useCallback((sectionId: string) => {
        setActiveSectionId(sectionId)
        setEditingItem(EMPTY_MENU_ITEM)
        setShowItemForm(true)
    }, [])

    const startEditItem = useCallback((item: IMenuItem) => {
        setEditingItem(item)
        setActiveSectionId(item.sectionId)
        setShowItemForm(true)
    }, [])

    const saveItem = useCallback(
        async (payload: IItemFormPayload) => {
            const isEditing = editingItem.id !== ""
            if (isEditing) {
                const updated = await updateItem(editingItem.id, {
                    name: payload.name,
                    description: payload.description,
                    price: payload.price,
                    isAvailable: payload.isAvailable,
                })
                if (updated.id === "") {
                    showToast("No se pudo guardar el producto.", "error")
                    return
                }
                let finalItem = updated
                if (payload.photoFile !== undefined) {
                    const photoUrl = await uploadItemPhoto(updated.id, payload.photoFile)
                    if (photoUrl !== "") finalItem = { ...updated, photoUrl }
                }
                setSections((prev) =>
                    prev.map((s) =>
                        s.id === activeSectionId
                            ? {
                                  ...s,
                                  items: s.items.map((i) =>
                                      i.id === finalItem.id ? finalItem : i
                                  ),
                              }
                            : s
                    )
                )
                showToast("Producto actualizado.", "success")
            } else {
                const created = await createItem(activeSectionId, {
                    name: payload.name,
                    description: payload.description,
                    price: payload.price,
                    isAvailable: payload.isAvailable,
                })
                if (created.id === "") {
                    showToast("No se pudo crear el producto.", "error")
                    return
                }
                let finalItem = created
                if (payload.photoFile !== undefined) {
                    const photoUrl = await uploadItemPhoto(created.id, payload.photoFile)
                    if (photoUrl !== "") finalItem = { ...created, photoUrl }
                }
                setSections((prev) =>
                    prev.map((s) =>
                        s.id === activeSectionId
                            ? { ...s, items: [...s.items, finalItem] }
                            : s
                    )
                )
                showToast("Producto creado.", "success")
            }
            closeItemForm()
        },
        [editingItem.id, activeSectionId, showToast, closeItemForm]
    )

    const toggleItemAvailable = useCallback(
        async (item: IMenuItem) => {
            const newValue = !item.isAvailable
            setSections((prev) =>
                prev.map((s) =>
                    s.id === item.sectionId
                        ? {
                              ...s,
                              items: s.items.map((i) =>
                                  i.id === item.id ? { ...i, isAvailable: newValue } : i
                              ),
                          }
                        : s
                )
            )
            const updated = await updateItem(item.id, {
                name: item.name,
                description: item.description,
                price: item.price,
                isAvailable: newValue,
            })
            if (updated.id === "") {
                setSections((prev) =>
                    prev.map((s) =>
                        s.id === item.sectionId
                            ? {
                                  ...s,
                                  items: s.items.map((i) =>
                                      i.id === item.id
                                          ? { ...i, isAvailable: item.isAvailable }
                                          : i
                                  ),
                              }
                            : s
                    )
                )
                showToast("No se pudo actualizar la disponibilidad.", "error")
            }
        },
        [showToast]
    )

    const requestDeleteItem = useCallback((id: string) => {
        setPendingDeleteItemId(id)
    }, [])

    const cancelDeleteItem = useCallback(() => {
        setPendingDeleteItemId("")
    }, [])

    const confirmDeleteItem = useCallback(async () => {
        const id = pendingDeleteItemId
        if (id === "") return
        const ok = await deleteItem(id)
        if (!ok) {
            showToast("No se pudo eliminar el producto.", "error")
            return
        }
        setSections((prev) =>
            prev.map((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }))
        )
        setPendingDeleteItemId("")
        showToast("Producto eliminado.", "success")
    }, [pendingDeleteItemId, showToast])

    const onSectionDragStart = useCallback((id: string) => {
        setDraggedSectionId(id)
    }, [])

    const onSectionDrop = useCallback(
        async (targetId: string) => {
            const fromId = draggedSectionId
            setDraggedSectionId("")
            if (fromId === "" || fromId === targetId) return

            const items = [...sections]
            const fromIdx = items.findIndex((s) => s.id === fromId)
            const toIdx = items.findIndex((s) => s.id === targetId)
            if (fromIdx === -1 || toIdx === -1) return

            const removed = items[fromIdx]
            if (removed === undefined) return
            items.splice(fromIdx, 1)
            items.splice(toIdx, 0, removed)
            const reordered = items.map((s, i) => ({ ...s, sortOrder: i + 1 }))
            setSections(reordered)

            const movedSection = reordered.find((s) => s.id === fromId)
            if (movedSection === undefined) return
            await updateSection(fromId, { sortOrder: movedSection.sortOrder })
        },
        [draggedSectionId, sections]
    )

    const onItemDragStart = useCallback((id: string, sectionId: string) => {
        setDraggedItemId(id)
        setDraggedItemSectionId(sectionId)
    }, [])

    const onItemDrop = useCallback(
        async (targetId: string, targetSectionId: string) => {
            const fromId = draggedItemId
            const fromSectionId = draggedItemSectionId
            setDraggedItemId("")
            setDraggedItemSectionId("")

            if (fromId === "" || fromId === targetId || fromSectionId !== targetSectionId) return

            const section = sections.find((s) => s.id === fromSectionId)
            if (section === undefined) return

            const items = [...section.items]
            const fromIdx = items.findIndex((i) => i.id === fromId)
            const toIdx = items.findIndex((i) => i.id === targetId)
            if (fromIdx === -1 || toIdx === -1) return

            const removed = items[fromIdx]
            if (removed === undefined) return
            items.splice(fromIdx, 1)
            items.splice(toIdx, 0, removed)
            const reordered = items.map((it, i) => ({ ...it, sortOrder: i + 1 }))

            setSections((prev) =>
                prev.map((s) =>
                    s.id === fromSectionId ? { ...s, items: reordered } : s
                )
            )

            const movedItem = reordered.find((it) => it.id === fromId)
            if (movedItem === undefined) return
            await updateItem(fromId, {
                name: movedItem.name,
                description: movedItem.description,
                price: movedItem.price,
                isAvailable: movedItem.isAvailable,
                sortOrder: movedItem.sortOrder,
            })
        },
        [draggedItemId, draggedItemSectionId, sections]
    )

    return {
        sections,
        isLoading,
        toast,
        expandedSections,
        editingSectionId,
        pendingDeleteSectionId,
        pendingDeleteItemId,
        activeSectionId,
        editingItem,
        showItemForm,
        draggedSectionId,
        draggedItemId,
        toggleSection,
        startEditSection,
        cancelEditSection,
        saveEditSection,
        toggleSectionActive,
        submitNewSection,
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
    }
}

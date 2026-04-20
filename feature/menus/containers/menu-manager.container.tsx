"use client"

import { useState } from "react"
import { useMenuManager } from "../hooks/use-menu-manager.hook"
import { SectionList } from "../components/section-list.component"
import { Toast } from "@/feature/shared/components/toast.component"
import styles from "../styles/menu-manager.style.module.css"

export function MenuManagerContainer() {
    const hook = useMenuManager()
    const [showNewSectionForm, setShowNewSectionForm] = useState(false)
    const [newSectionName, setNewSectionName] = useState("")

    const handleSubmitNewSection = async (e: React.FormEvent) => {
        e.preventDefault()
        await hook.submitNewSection(newSectionName)
        setNewSectionName("")
        setShowNewSectionForm(false)
    }

    const handleCancelNewSection = () => {
        setNewSectionName("")
        setShowNewSectionForm(false)
    }

    return (
        <section className={styles.menuManager} data-testid="menu-manager">
            <div className={styles.menuHeader}>
                <h2 className={styles.menuManagerTitle}>Gestión de Menú</h2>
                <button
                    type="button"
                    className={styles.newSectionButton}
                    onClick={() => setShowNewSectionForm(true)}
                    data-testid="new-section-button"
                >
                    + Nueva sección
                </button>
            </div>

            {showNewSectionForm && (
                <form
                    className={styles.newSectionForm}
                    onSubmit={handleSubmitNewSection}
                    data-testid="new-section-form"
                >
                    <input
                        className={styles.newSectionInput}
                        type="text"
                        placeholder="Nombre de la sección"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        autoFocus
                        data-testid="new-section-name-input"
                    />
                    <div className={styles.newSectionFormActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancelNewSection}
                            data-testid="new-section-cancel"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.saveButton}
                            data-testid="new-section-submit"
                        >
                            Crear sección
                        </button>
                    </div>
                </form>
            )}

            {hook.isLoading && (
                <p className={styles.loadingText} data-testid="menu-loading">
                    Cargando menú...
                </p>
            )}

            {!hook.isLoading && <SectionList hook={hook} />}

            <Toast message={hook.toast.message} type={hook.toast.type} />
        </section>
    )
}

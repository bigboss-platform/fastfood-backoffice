"use client"

import { useState, useCallback, useRef } from "react"

export type ToastType = "success" | "error"

export interface IToast {
    id: string
    message: string
    type: ToastType
}

const EMPTY_TOAST: IToast = { id: "", message: "", type: "success" }

interface IUseToast {
    toast: IToast
    showToast: (message: string, type: ToastType, duration?: number) => void
}

export function useToast(): IUseToast {
    const [toast, setToast] = useState<IToast>(EMPTY_TOAST)
    const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const showToast = useCallback((message: string, type: ToastType, duration = 3000) => {
        if (timerRef.current !== undefined) clearTimeout(timerRef.current)
        const id = String(Date.now())
        setToast({ id, message, type })
        timerRef.current = setTimeout(() => {
            setToast(EMPTY_TOAST)
            timerRef.current = undefined
        }, duration)
    }, [])

    return { toast, showToast }
}

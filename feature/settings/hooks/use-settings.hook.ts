"use client"

import { useState, useEffect } from "react"
import {
    fetchSettings,
    fetchTheme,
    EMPTY_SETTINGS,
    EMPTY_THEME_SETTINGS,
} from "../services/settings.service"
import type { ISettings, IThemeSettings } from "../services/settings.service"

export interface IUseSettings {
    settings: ISettings
    theme: IThemeSettings
    isLoading: boolean
}

export function useSettings(): IUseSettings {
    const [settings, setSettings] = useState<ISettings>(EMPTY_SETTINGS)
    const [theme, setTheme] = useState<IThemeSettings>(EMPTY_THEME_SETTINGS)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function loadAll() {
            const [settingsResult, themeResult] = await Promise.all([
                fetchSettings(),
                fetchTheme(),
            ])
            setSettings(settingsResult.settings)
            setTheme(themeResult.theme)
            setIsLoading(false)
        }
        loadAll()
    }, [])

    return { settings, theme, isLoading }
}

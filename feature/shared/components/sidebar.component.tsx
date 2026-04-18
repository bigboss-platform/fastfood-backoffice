"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAdminSession } from "@/feature/auth/hooks/use-admin-session.hook"
import styles from "../styles/sidebar.style.module.css"

interface SidebarNavItem {
    label: string
    href: string
    icon: string
}

const NAV_ITEMS: SidebarNavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "Pedidos", href: "/orders", icon: "📋" },
    { label: "Cocina", href: "/chef", icon: "👨‍🍳" },
    { label: "Menú", href: "/menus", icon: "🍔" },
    { label: "Analíticas", href: "/analytics", icon: "📈" },
    { label: "Ajustes", href: "/settings", icon: "⚙️" },
]

export function Sidebar() {
    const pathname = usePathname()
    const { profile, logout } = useAdminSession()
    const hasAdminName = Boolean(profile.name)

    return (
        <aside className={styles.sidebar} aria-label="Navegación principal">
            <div className={styles.sidebarBrand}>
                <span className={styles.sidebarBrandName}>BigBoss</span>
                {hasAdminName && (
                    <span className={styles.sidebarAdminName}>{profile.name}</span>
                )}
            </div>
            <nav className={styles.sidebarNav}>
                <ul className={styles.sidebarNavList}>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href} className={styles.sidebarNavItem}>
                            <Link
                                href={item.href}
                                className={`${styles.sidebarNavLink} ${pathname === item.href ? styles.sidebarNavLinkActive : ""}`}
                                {...(pathname === item.href && { "aria-current": "page" as const })}
                            >
                                <span className={styles.sidebarNavIcon} aria-hidden="true">
                                    {item.icon}
                                </span>
                                <span className={styles.sidebarNavLabel}>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={styles.sidebarFooter}>
                <button
                    data-testid="logout-button"
                    type="button"
                    className={styles.logoutButton}
                    onClick={logout}
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}

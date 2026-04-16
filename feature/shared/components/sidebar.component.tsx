"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

    return (
        <aside className={styles.sidebar} aria-label="Navegación principal">
            <div className={styles.sidebarBrand}>
                <span className={styles.sidebarBrandName}>BigBoss</span>
            </div>
            <nav className={styles.sidebarNav}>
                <ul className={styles.sidebarNavList}>
                    {NAV_ITEMS.map((item) => (
                        <li key={item.href} className={styles.sidebarNavItem}>
                            <Link
                                href={item.href}
                                className={`${styles.sidebarNavLink} ${pathname === item.href ? styles.sidebarNavLinkActive : ""}`}
                                aria-current={pathname === item.href ? "page" : undefined}
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
        </aside>
    )
}

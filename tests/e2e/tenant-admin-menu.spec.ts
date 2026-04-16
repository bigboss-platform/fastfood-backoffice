import { test, expect } from "@playwright/test"

const ADMIN_EMAIL = process.env["E2E_ADMIN_EMAIL"] ?? "admin@demo-fastfood.com"
const ADMIN_PASSWORD = process.env["E2E_ADMIN_PASSWORD"] ?? "adminpassword123"

async function loginAsAdmin(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
    await page.goto("/login")
    await page.getByTestId("email-input").fill(ADMIN_EMAIL)
    await page.getByTestId("password-input").fill(ADMIN_PASSWORD)
    await page.getByTestId("login-button").click()
    await page.waitForURL("/dashboard")
}

test.describe("Tenant Admin — Menu Management", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page)
    })

    test("menus page loads", async ({ page }) => {
        await page.goto("/menus")
        await expect(page.getByTestId("menu-manager")).toBeVisible()
    })

    test("dashboard shows stats", async ({ page }) => {
        await page.goto("/dashboard")
        await expect(page.getByTestId("stat-orders-today")).toBeVisible()
        await expect(page.getByTestId("stat-revenue-today")).toBeVisible()
        await expect(page.getByTestId("stat-active-orders")).toBeVisible()
        await expect(page.getByTestId("stat-pending-payments")).toBeVisible()
    })

    test("analytics page loads", async ({ page }) => {
        await page.goto("/analytics")
        await expect(page.getByTestId("analytics-placeholder")).toBeVisible()
    })

    test("settings page loads", async ({ page }) => {
        await page.goto("/settings")
        await expect(page.getByTestId("settings-placeholder")).toBeVisible()
    })

    test("sidebar navigation links are present", async ({ page }) => {
        await page.goto("/dashboard")
        await expect(page.getByTestId("nav-dashboard")).toBeVisible()
        await expect(page.getByTestId("nav-orders")).toBeVisible()
        await expect(page.getByTestId("nav-chef")).toBeVisible()
        await expect(page.getByTestId("nav-menus")).toBeVisible()
        await expect(page.getByTestId("nav-analytics")).toBeVisible()
        await expect(page.getByTestId("nav-settings")).toBeVisible()
    })
})

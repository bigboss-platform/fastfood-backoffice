import { test, expect } from "@playwright/test"

const STAFF_EMAIL = process.env["E2E_STAFF_EMAIL"] ?? "staff@demo-fastfood.com"
const STAFF_PASSWORD = process.env["E2E_STAFF_PASSWORD"] ?? "testpassword123"

async function loginAsStaff(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
    await page.goto("/login")
    await page.getByTestId("email-input").fill(STAFF_EMAIL)
    await page.getByTestId("password-input").fill(STAFF_PASSWORD)
    await page.getByTestId("login-button").click()
    await page.waitForURL("/dashboard")
}

test.describe("Staff Order Management", () => {
    test.beforeEach(async ({ page }) => {
        await loginAsStaff(page)
    })

    test("orders page loads with order list", async ({ page }) => {
        await page.goto("/orders")
        await expect(page.getByTestId("order-list")).toBeVisible()
    })

    test("can filter orders by status", async ({ page }) => {
        await page.goto("/orders")
        await page.getByTestId("status-filter-preparing").click()
        const orders = page.getByTestId("order-card")
        const count = await orders.count()
        for (let i = 0; i < count; i++) {
            await expect(orders.nth(i).getByTestId("order-status")).toContainText("preparando")
        }
    })

    test("can advance order status", async ({ page }) => {
        await page.goto("/orders")
        const firstOrder = page.getByTestId("order-card").first()
        await firstOrder.click()
        await page.getByTestId("advance-status-button").click()
        await expect(page.getByTestId("success-toast")).toBeVisible()
    })

    test("can update payment information", async ({ page }) => {
        await page.goto("/orders")
        const firstOrder = page.getByTestId("order-card").first()
        await firstOrder.click()
        await page.getByTestId("edit-payment-button").click()

        await page.getByTestId("payment-method-input").selectOption("efectivo")
        await page.getByTestId("payment-amount-input").fill("150.00")
        await page.getByTestId("payment-status-input").selectOption("pagado")
        await page.getByTestId("save-payment-button").click()

        await expect(page.getByTestId("success-toast")).toBeVisible()
    })

    test("chef view displays active orders as cards", async ({ page }) => {
        await page.goto("/chef")
        await expect(page.getByTestId("chef-board")).toBeVisible()
    })

    test("chef view auto-refreshes", async ({ page }) => {
        await page.goto("/chef")
        await expect(page.getByTestId("chef-board")).toBeVisible()
        await page.waitForTimeout(11000)
        await expect(page.getByTestId("chef-board")).toBeVisible()
    })
})

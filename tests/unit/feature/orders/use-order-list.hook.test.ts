import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useOrderList } from "@/feature/orders/hooks/use-order-list.hook"

vi.mock("@/feature/orders/services/order.service", () => ({
    fetchOrders: vi.fn().mockResolvedValue([
        {
            id: "order-1",
            status: "recibido",
            delivery_type: "recogida",
            subtotal: 100,
            total: 100,
            items: [],
            payment_status: "pendiente",
            created_at: new Date().toISOString(),
        },
        {
            id: "order-2",
            status: "preparando",
            delivery_type: "entrega",
            subtotal: 200,
            total: 250,
            items: [],
            payment_status: "pagado",
            created_at: new Date().toISOString(),
        },
    ]),
}))

describe("useOrderList", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("starts with empty order list", () => {
        const { result } = renderHook(() => useOrderList("test-token"))
        expect(result.current.orders).toHaveLength(0)
    })

    it("loads orders after refresh is called", async () => {
        const { result } = renderHook(() => useOrderList("test-token"))
        await act(async () => {
            await result.current.refresh()
        })
        expect(result.current.orders).toHaveLength(2)
    })

    it("statusFilter defaults to empty string (all orders)", () => {
        const { result } = renderHook(() => useOrderList("test-token"))
        expect(result.current.statusFilter).toBe("")
    })

    it("setStatusFilter updates the filter", () => {
        const { result } = renderHook(() => useOrderList("test-token"))
        act(() => {
            result.current.setStatusFilter("preparando")
        })
        expect(result.current.statusFilter).toBe("preparando")
    })
})

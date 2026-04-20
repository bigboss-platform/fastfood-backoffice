export function getTimeElapsed(createdAt: string): string {
    const now = Date.now()
    const created = new Date(createdAt).getTime()
    const diffSeconds = Math.floor((now - created) / 1000)
    if (diffSeconds < 60) return `${diffSeconds}s`
    const diffMinutes = Math.floor(diffSeconds / 60)
    if (diffMinutes < 60) return `${diffMinutes}m`
    const diffHours = Math.floor(diffMinutes / 60)
    return `${diffHours}h`
}

export function isNewOrder(createdAt: string): boolean {
    const now = Date.now()
    const created = new Date(createdAt).getTime()
    return now - created < 60000
}

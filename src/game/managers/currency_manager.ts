import { type Currency } from "../currency";

export class CurrencyManager {
    private currencies: Record<string, Currency> = {
        divinity: {
            id: "divinity",
            amount: 0,
            max: 5,
            unlocked: true
        }
    }

    get(id: string) {
        return this.currencies[id]
    }

    add(id: string, amount: number) {
        const currency = this.currencies[id]
        if (!currency || !currency.unlocked) return 0

        const before = currency.amount
        currency.amount = Math.min(currency.amount + amount, currency.max)

        return currency.amount - before
    }

    spend(id: string, amount: number) {
        const currency = this.currencies[id]
        if (!currency || currency.amount < amount) return false

        currency.amount -= amount
        return true
    }

    increaseMax(id: string, amount: number) {
        const currency = this.currencies[id]
        if (!currency) return

        currency.max += amount
    }

    unlock(id: string, max: number) {
        this.currencies[id] = {
        id,
        amount: 0,
        max,
        unlocked: true
        }
    }

    getVisibleCurrencies() {
        return Object.values(this.currencies).filter(c => c.unlocked)
    }
}
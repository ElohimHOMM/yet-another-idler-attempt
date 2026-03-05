import type { Notation } from "../game/settings"

export class NumberFormatter {
  format(value: number, notation: Notation): string {
    if (value < 1000) return Math.floor(value).toString()

    switch (notation) {
      case "scientific":
        return value.toExponential(3)

      case "engineering":
        const exponent = Math.floor(Math.log10(value) / 3) * 3
        const scaled = value / Math.pow(10, exponent)
        return `${scaled.toFixed(3)}e${exponent}`

      case "short":
      default:
        return this.formatShort(value)
    }
  }

  private formatShort(value: number): string {
    const units = ["", "K", "M", "B", "T", "Qa", "Qi"]
    let unitIndex = 0

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000
      unitIndex++
    }

    return `${value.toFixed(2)}${units[unitIndex]}`
  }
}
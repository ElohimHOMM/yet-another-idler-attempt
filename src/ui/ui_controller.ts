import { Game } from "../game/game"
import { Settings } from "../game/settings"
import { NumberFormatter } from "../utils/number_formatter"
import { ModalManager } from "./modal_manager"

export class UIController {
    private game: Game
    private settings: Settings

    private divinityElement: HTMLElement
    private manualClickButton: HTMLElement
    private infoButton: HTMLElement
    private settingsButton: HTMLElement

    private tabButtons: NodeListOf<HTMLButtonElement>
    private tabPanels: NodeListOf<HTMLElement>

    private formatter = new NumberFormatter()
    private modals = new ModalManager()

    constructor(game: Game, settings: Settings) {
        this.game = game
        this.settings = settings

        this.divinityElement = document.getElementById("points")!
        this.manualClickButton = document.getElementById("manual-click")!
        this.infoButton = document.getElementById("info-button")!
        this.settingsButton = document.getElementById("settings-button")!
        this.tabButtons = document.querySelectorAll(".tab-button")
        this.tabPanels = document.querySelectorAll(".tab-panel")
    }

    async init() {
        this.modals.registerModal("settings-modal")
        this.modals.registerModal("info-modal")

        this.bindEvents()
        this.initializeTabs()
    }

    private initializeTabs() {
        this.tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab
            if (!target) return

            // Hide all panels
            this.tabPanels.forEach(panel => panel.classList.add("hidden"))
            // Show target panel
            const activePanel = document.getElementById(target)
            activePanel?.classList.remove("hidden")

            // Optionally update button styles
            this.tabButtons.forEach(b => b.classList.remove("bg-neutral-600", "text-white"))
            btn.classList.add("bg-neutral-600", "text-white")
        })
        })

        // Activate first tab by default
        const first = this.tabButtons[0]
        first.click()
    }

    private bindEvents() {
        this.manualClickButton.addEventListener("click", () => {
            this.game.addPoints(1)
        })

        this.infoButton.addEventListener("click", () => {
            this.modals.open("info-modal")
        })

        this.settingsButton.addEventListener("click", () => {
            this.modals.open("settings-modal")

            const select = document.getElementById("notation-select") as HTMLSelectElement
            select.value = this.settings.getNotation()

            select.addEventListener("change", () => {
                this.settings.setNotation(select.value as any)
            })
        })
    }

    render() {
        // Update sidebar currencies
        this.divinityElement.textContent = this.formatter.format(this.game.points, this.settings.getNotation())

        // Other currencies if any:
        const nextPointsEl = document.getElementById("next-points")
        if (nextPointsEl) {
            nextPointsEl.textContent = "0"
        }

        // Optional: render active tab content (if dynamic)
    }
}
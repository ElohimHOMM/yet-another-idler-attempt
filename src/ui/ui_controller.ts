import { Game } from "../game/game"
import { Settings } from "../game/settings"
import { NumberFormatter } from "../utils/number_formatter"
import { SettingsModal } from "./modals/settings_modal"
import { InfoModal } from "./modals/info_modal"
import { BaseTab } from "./tabs/base_tab"
import { MainTab } from "./tabs/main_tab"
import { ShopTab } from "./tabs/shop_tab"
import { StoryTab } from "./tabs/story_tab"

export class UIController {
    private game: Game
    private settings: Settings

    private tabs: Record<string, BaseTab> = {}
    private activeTab: BaseTab | null = null
    private divinityElement: HTMLElement
    private nextPointsElement: HTMLElement

    private infoButton: HTMLElement
    private settingsButton: HTMLElement

    private tabButtons: NodeListOf<HTMLButtonElement>
    private tabPanels: NodeListOf<HTMLElement>

    private formatter = new NumberFormatter()

    private settingsModal: SettingsModal
    private infoModal: InfoModal

    private storyTabButton: HTMLElement

    constructor(game: Game, settings: Settings) {
        this.game = game
        this.settings = settings

        this.divinityElement = document.getElementById("points")!
        this.nextPointsElement = document.getElementById("next-points")!
        this.infoButton = document.getElementById("info-button")!
        this.settingsButton = document.getElementById("settings-button")!
        this.tabButtons = document.querySelectorAll(".tab-button")
        this.tabPanels = document.querySelectorAll(".tab-panel")
        this.settingsModal = new SettingsModal(this.settings)
        this.infoModal = new InfoModal()

        this.storyTabButton = document.querySelector('[data-tab="story"]')!
    }

    async init() {
        await this.settingsModal.init()
        await this.infoModal.init()

        this.tabs["main"] = new MainTab(this.game)
        this.tabs["shop"] = new ShopTab(this.game)
        this.tabs["story"] = new StoryTab(this.game)

        Object.values(this.tabs).forEach(tab => tab.init())

        this.bindEvents()
        this.initializeTabs()
        
        this.activeTab = this.tabs["main"]
    }

    private initializeTabs() {
        this.tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.tab
                if (!id) return

                // Hide all panels
                this.tabPanels.forEach(p => p.classList.add("hidden"))

                // Hide previous tab
                this.activeTab?.onHide()

                // Show new tab
                const panel = document.getElementById(id)
                panel?.classList.remove("hidden")

                const newTab = this.tabs[id]
                this.activeTab = newTab

                newTab?.onShow()

                // Update button styles
                this.tabButtons.forEach(b =>
                    b.classList.remove("bg-neutral-600", "text-white")
                )
                btn.classList.add("bg-neutral-600", "text-white")
            })
        })

        // Activate first tab by default
        const first = this.tabButtons[0]
        first.click()
    }

    private bindEvents() {
        this.settingsButton.addEventListener("click", () => {
            this.settingsModal.open()
        })

        this.infoButton.addEventListener("click", () => {
            this.infoModal.open()
        })
    }

    private updateCurrencies() {
        this.divinityElement.textContent =
            this.formatter.format(this.game.currencies.get("divinity")!.amount, this.settings.getNotation()) + " / " + 
            this.formatter.format(this.game.currencies.get("divinity")!.max, this.settings.getNotation())
    }

    render() {
        const now = performance.now()

        this.activeTab?.render(now)

        if (this.game.story.hasUnreadEntries()) {
            this.storyTabButton.classList.add("tab-flash")
        } else {
            this.storyTabButton.classList.remove("tab-flash")
        }

        if (this.game.isDirty()) {
            this.updateCurrencies()
            this.game.clearDirty()
        }
    }
}
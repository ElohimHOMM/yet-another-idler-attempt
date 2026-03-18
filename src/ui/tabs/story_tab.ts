import { BaseTab } from "./base_tab"
import { Game } from "../../game/game"

export class StoryTab extends BaseTab {
  private listEl: HTMLElement
  private titleEl: HTMLElement
  private textEl: HTMLElement

  private game: Game

  private selectedId: string | null = null

  constructor(game: Game) {
    super("story")

    this.listEl = this.root.querySelector("#story-list")!
    this.titleEl = this.root.querySelector("#story-title")!
    this.textEl = this.root.querySelector("#story-text")!
    this.game = game
}

  init() {
    this.renderList()
  }

  onShow() {
    this.renderList()
  }

  render() {
    // Only rerender list if needed (optional optimization later)
  }

  private renderList() {
    const entries = this.game.story.getUnlockedEntries()

    this.listEl.innerHTML = ""

    // ensure that the latest unlocks are at the top
    entries.sort((a, b) => b.id.localeCompare(a.id)).forEach(entry => {
      const el = document.createElement("div")

      el.className = `
        p-3 mb-2 rounded-lg cursor-pointer
        transition-all duration-150
        bg-neutral-600 hover:bg-neutral-500
        flex justify-between items-center
      `
      const title = document.createElement("span")
      title.textContent = entry.title
      el.appendChild(title)

      // 🟣 UNREAD INDICATOR
      if (!entry.read) {
        el.classList.add("border-l-4", "border-red-500", "animate-pulse")

        const unreadDot = document.createElement("span")
        unreadDot.className = "text-red-500 ml-2"
        unreadDot.textContent = "●"
        el.appendChild(unreadDot)
      }

      // 🟢 SELECTED STATE
      if (entry.id === this.selectedId) {
        el.classList.remove("bg-neutral-600", "hover:bg-neutral-500")
        el.classList.add("border-l-4", "border-neutral-200", "bg-neutral-400")

        const currentDot = document.createElement("span")
        currentDot.className = "text-neutral-200 ml-2"
        currentDot.textContent = "●"
        el.appendChild(currentDot)
      }

      el.addEventListener("click", () => {
        this.selectEntry(entry.id)
      })

      this.listEl.appendChild(el)
    })
  }

  private selectEntry(id: string) {
    const entry = this.game.story.getUnlockedEntries().find(e => e.id === id)
    if (!entry) return

    this.selectedId = id

    this.titleEl.textContent = entry.title
    this.textEl.textContent = entry.content

    this.game.story.markAsRead(id)

    this.renderList()
  }
}
import { BaseTab } from "./base_tab"
import { Game } from "../../game/game"
import { UIComponent } from "../elements/ui_component"

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
    this.game.story.markAllRead()
    this.renderList()
  }

  render() {
    // Only rerender list if needed (optional optimization later)
  }

  private renderList() {
    const entries = this.game.story.getUnlockedEntries()

    this.listEl.innerHTML = ""

    entries.forEach(entry => {
      const el = document.createElement("div")

      el.className =
        "p-3 mb-2 rounded-lg cursor-pointer bg-neutral-600 hover:bg-neutral-500"

      // Highlight unread
      if (!entry.read) {
        el.classList.add("border-l-4", "border-indigo-400")
      }

      el.textContent = entry.title

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

    entry.read = true

    // Update list to remove highlight
    this.renderList()
  }
}
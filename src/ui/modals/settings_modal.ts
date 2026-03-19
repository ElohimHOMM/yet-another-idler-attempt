import { BaseModal } from "./base_modal"
import { Settings } from "../../game/settings"

const STORAGE_KEY = "yaia-save"

export class SettingsModal extends BaseModal {
  private notationSelect!: HTMLSelectElement
  private settings: Settings

  constructor(settings: Settings) {
    super("settings-modal")
    this.settings = settings
  }

  protected onInit() {
    this.notationSelect = this.root.querySelector("#notation-select") as HTMLSelectElement
    this.root.querySelector("#delete-save")?.addEventListener("click", () => {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (!raw) return
          localStorage.removeItem(STORAGE_KEY)
          window.location.reload()
        })

    this.notationSelect.addEventListener("change", () => {
      this.settings.setNotation(this.notationSelect.value as any)
    })
  }

  protected onOpen() {
    this.notationSelect.value = this.settings.getNotation()
  }
}
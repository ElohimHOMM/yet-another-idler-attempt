import { BaseModal } from "./base_modal"
import { Settings } from "../../game/settings"

export class SettingsModal extends BaseModal {
  private notationSelect!: HTMLSelectElement
  private settings: Settings

  constructor(settings: Settings) {
    super("settings-modal")
    this.settings = settings
  }

  protected onInit() {
    this.notationSelect = this.root.querySelector(
      "#notation-select"
    ) as HTMLSelectElement

    this.notationSelect.addEventListener("change", () => {
      this.settings.setNotation(this.notationSelect.value as any)
    })
  }

  protected onOpen() {
    this.notationSelect.value = this.settings.getNotation()
  }
}
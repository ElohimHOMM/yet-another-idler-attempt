export abstract class BaseModal {
  protected root!: HTMLElement
  private loaded = false
  private id: string;

  constructor(id: string) {
    this.id = id
  }

  async init() {
    if (this.loaded) return

    await this.loadTemplate(`/templates/${this.id}.html`)

    const el = document.getElementById(this.id)
    if (!el) throw new Error(`Modal ${this.id} not found after loading`)

    this.root = el
    this.setupCloseButtons()
    this.onInit()

    this.loaded = true
  }

  open() {
    this.root.classList.remove("hidden")
    this.onOpen()
  }

  close() {
    this.root.classList.add("hidden")
  }

  protected abstract onInit(): void
  protected onOpen(): void {}

  private setupCloseButtons() {
    const buttons = this.root.querySelectorAll("[data-close-modal]")

    buttons.forEach(btn =>
      btn.addEventListener("click", () => this.close())
    )

    this.root.addEventListener("click", e => {
      if (e.target === this.root) this.close()
    })
  }

  private async loadTemplate(path: string) {
    const response = await fetch(path)
    const html = await response.text()

    const container = document.createElement("div")
    container.innerHTML = html

    document
      .getElementById("modal-root")!
      .appendChild(container.firstElementChild!)
  }
}
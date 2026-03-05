export class ModalManager {
  private modals: Record<string, HTMLElement> = {}

  constructor() {}

  // Register a modal by its ID
  async registerModal(id: string) {
    await this.loadTemplate(`/templates/${id}.html`)

    const el = document.getElementById(id)
    if (!el) throw new Error(`Modal with ID "${id}" not found`)

    this.modals[id] = el

    this.setupCloseButtons(el)
  }

  // Show a modal
  open(id: string) {
    const modal = this.modals[id]
    if (!modal) return
    modal.classList.remove("hidden")
  }

  // Hide a modal
  close(id: string) {
    const modal = this.modals[id]
    if (!modal) return
    modal.classList.add("hidden")
  }

  // Automatically setup click listeners on close buttons inside modal
  private setupCloseButtons(modal: HTMLElement) {
    const closeButtons = modal.querySelectorAll("[data-close-modal]")
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.classList.add("hidden")
      })
    })

    // Optional: click outside modal content closes it
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden")
      }
    })
  }

  private async loadTemplate(path: string) {
    const response = await fetch(path)
    const html = await response.text()

    const container = document.createElement("div")
    container.innerHTML = html

    document.getElementById("modal-root")!.appendChild(container.firstElementChild!)
  }
}
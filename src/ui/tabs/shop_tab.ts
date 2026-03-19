import { BaseTab } from "./base_tab"
import { Game } from "../../game/game"
// import type { UIComponent } from "../elements/ui_component"

export class ShopTab extends BaseTab {
    //private components: UIComponent[] = []
    private game: Game

    constructor(game: Game) {
        super("shop")
        this.game = game
    }

    init() {
        const buyButton = document.getElementById("buy-speed")!
        // this.components.push(buyButton)

        buyButton.addEventListener("click", () => {
        const success = this.game.buyFasterAction()

        if (success) {
            this.updateShopUI()
        }
        })
    }

    updateShopUI() {
        const btn = document.getElementById("buy-speed") as HTMLButtonElement

        btn.disabled = this.game.divinity < 5
    }

    render() {
        this.updateShopUI()
    }
}
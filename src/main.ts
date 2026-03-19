import "./style.css"

import { Game } from "./game/game"
import { SaveManager } from "./game/managers/save_manager"
import { Settings } from "./game/settings"
import { UIController } from "./ui/ui_controller"
import { loadStoryData } from "./game/managers/story_manager"

const storyData = await loadStoryData()
const game = new Game(storyData)
const saveSystem = new SaveManager()
const settings = new Settings()

// Load save
const loaded = saveSystem.load()
if (loaded) {
  game.load(loaded)
}

const ui = new UIController(game, settings)
await ui.init()

// Game Loop
function loop() {
  const now = performance.now()

  game.update(now)
  ui.render()
  
  requestAnimationFrame(loop)
}

loop()

// Autosave every 10s
setInterval(() => {
  saveSystem.save(game.toSaveData())
}, 10000)
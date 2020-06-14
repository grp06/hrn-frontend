import Sprite from './sprite'

import cactusLargeImg from './images/cactus_large.png'
import cactusSmallImg from './images/cactus_small.png'

class Obstacle extends Sprite {
  groundY

  config = {
    IMG_SRC: [cactusSmallImg, cactusLargeImg],
    X_POS: null,
    Y_POS: null,
    GROUND_HEIGHT: 20,
  }

  constructor(canvas, options = {}) {
    super(canvas, options)
    this.config = {
      ...this.config,
      ...options,
    }
    this.xPos = this.config.X_POS || 0
    if (this.config.Y_POS && this.config.GROUND_HEIGHT) {
      throw new Error("options 'Y_POS' and 'GROUND_HEIGHT' exist simultaneously")
    }
    this.groundY = this.canvas.height - this.img.height - this.config.GROUND_HEIGHT
    this.yPos = this.config.Y_POS || this.groundY
  }

  update(deltaTime = 1 / 16, speed = 0) {
    this.xPos -= speed * deltaTime
    super.update()
  }
}

export default Obstacle

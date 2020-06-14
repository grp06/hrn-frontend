import defaultImg from './images/ground.png'
import Sprite from './sprite'

class Ground extends Sprite {
  groundY

  config = {
    IMG_SRC: defaultImg,
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
    this.groundY =
      this.config.Y_POS || this.canvas.height - this.img.height - this.config.GROUND_HEIGHT
    this.yPos = this.groundY
  }

  update(deltaTime = 1 / 16, speed = 0) {
    this.xPos -= speed * deltaTime
    super.update()
  }
}

export default Ground

import Sprite from './sprite'

import defaultTrexImg from './images/tRex.png'
import tRexCrashImg from './images/trex_crash.png'
import tRexDuck1Img from './images/trex_duck_1.png'
import tRexDuck2Img from './images/trex_duck_2.png'
import tRexFistFrameImg from './images/trex_first_frame.png'
import jumpSound from './sounds/button-press.mp3'
import hitSound from './sounds/hit.mp3'

const STATUS = Object.freeze({
  START: 'START',
  JUMP: 'JUMP',
  DUCK_1: 'DUCK_1',
  DUCK_2: 'DUCK_2',
  CRASH: 'CRASH',
})

class Trex extends Sprite {
  jumpVelocity = 0
  groundY
  status
  duckTime = 0
  audioMap = new Map()

  config = {
    IMG_SRC: defaultTrexImg,
    STATUS: {
      START: { img: tRexFistFrameImg },
      JUMP: { img: defaultTrexImg },
      DUCK_1: { img: tRexDuck1Img },
      DUCK_2: { img: tRexDuck2Img },
      CRASH: { img: tRexCrashImg },
    },
    DUCK_INTERVAL: 0.1,
    X_POS: 20,
    Y_POS: 0,
    GROUND_HEIGHT: 20,
    GRAVITY: 2000,
    JUMP_SPEED: 550,
    SPEED: 70, // move when you start the game for the first time
    SOUNDS: {
      JUMP: jumpSound,
      HIT: hitSound,
    },
  }

  constructor(canvas, options = {}) {
    super(canvas, options)
    this.config = {
      ...this.config,
      ...options,
    }
    this.loadSounds()
    this.xPos = 0
    this.groundY = this.canvas.height - this.img.height - this.config.GROUND_HEIGHT
    this.yPos = this.config.Y_POS || this.groundY
    this.status = STATUS.START
  }

  update(deltaTime = 1 / 16) {
    // move at the beginning of the first game
    if (this.status !== STATUS.JUMP && this.xPos < this.config.X_POS) {
      this.xPos += this.config.SPEED * deltaTime
      if (this.xPos > this.config.X_POS) {
        this.xPos = this.config.X_POS
      }
    }
    // jump
    if (this.status === STATUS.JUMP) {
      this.yPos -= this.jumpVelocity * deltaTime
      this.jumpVelocity -= this.config.GRAVITY * deltaTime
    }
    // Landing
    if (this.yPos > this.groundY) {
      this.yPos = this.groundY
      this.jumpVelocity = 0
      this.status = STATUS.DUCK_1
      this.duckTime = 0
    }
    // duck
    this.duckTime += deltaTime
    if (this.duckTime > this.config.DUCK_INTERVAL) {
      this.switchDuck()
      this.duckTime = 0
    }

    this.draw()
  }

  switchDuck() {
    if (this.status === STATUS.DUCK_1) {
      this.status = STATUS.DUCK_2
      return
    }
    if (this.status === STATUS.DUCK_2) {
      this.status = STATUS.DUCK_1
      return
    }
  }

  draw(img = this.config.STATUS[this.status].img) {
    super.draw(img)
  }

  jump(speed = this.config.JUMP_SPEED) {
    if (this.status === STATUS.JUMP || this.status === STATUS.CRASH) {
      return
    }
    this.status = STATUS.JUMP
    this.jumpVelocity = speed
    this.playSound(this.config.SOUNDS.JUMP)
  }

  crash() {
    this.status = STATUS.CRASH
    // landing
    this.jumpVelocity = -1 * Math.abs(this.jumpVelocity)
    this.playSound(this.config.SOUNDS.HIT)
  }

  start() {
    this.status = STATUS.JUMP
  }

  loadSounds() {
    Object.values(this.config.SOUNDS).forEach((src) => {
      const audio = new Audio(src)
      this.audioMap.set(src, audio)
    })
  }

  playSound(sound) {
    const audio = this.audioMap.get(sound)
    // HTMLMediaElement.readyState
    if (!audio || audio.readyState !== 4) {
      return
    }
    audio.play()
  }
}

export default Trex

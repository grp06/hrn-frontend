import { random } from 'lodash'
import * as React from 'react'
import Ground from './ground'
import Obstacle from './obstacle'

class GroundManager extends React.Component {
  canvas
  canvasCtx
  groundList
  lastGround
  obstacleList
  gameTime
  currentGap
  groundY
  config = {
    BUFFER_TIME: 2,
    GROUND_CONFIG: {},
    MAX_OBSTACLE_GAP: null,
    MIN_OBSTACLE_GAP: null,
    OBSTACLE_CONFIG: {
      X_POS: null,
    },
  }

  constructor(canvas, options = {}) {
    super(canvas, options)
    if (!canvas) {
      throw new Error('the parameter canvas is required!')
    }
    this.canvas = canvas
    this.canvasCtx = this.canvas.getContext('2d')

    this.config = {
      ...this.config,
      ...options,
    }

    this.config.OBSTACLE_CONFIG.X_POS = this.canvas.width
    this.config.MAX_OBSTACLE_GAP = this.canvas.width * 2
    this.config.MIN_OBSTACLE_GAP = this.canvas.width * 0.75
  }

  update(deltaTime, speed) {
    this.gameTime += deltaTime
    this.currentGap -= deltaTime * speed
    // ground
    this.groundList = this.groundList.filter((ground) => ground && !ground.remove)
    this.groundList.forEach((ground) => ground.update(deltaTime, speed))
    // add ground
    while (
      !this.lastGround ||
      this.lastGround.xPos + this.lastGround.img.width <= this.canvas.width
    ) {
      this.addGround(this.config.GROUND_CONFIG)
    }

    if (this.needToAddObstacle()) {
      this.addObstacle(this.config.OBSTACLE_CONFIG)
    }
    this.obstacleList = this.obstacleList.filter((obstacle) => obstacle && !obstacle.remove)
    this.obstacleList.forEach((obstacle) => obstacle.update(deltaTime, speed))
  }

  addGround(options = {}) {
    const ground = new Ground(this.canvas, options)
    if (this.lastGround) {
      ground.xPos = this.lastGround.xPos + this.lastGround.img.width
    }
    this.groundList.push(ground)
    this.lastGround = ground
  }

  addObstacle(options = {}) {
    const obstacle = new Obstacle(this.canvas, options)
    this.obstacleList.push(obstacle)
    this.currentGap =
      this.canvas.width -
      obstacle.xPos +
      obstacle.img.width +
      random(this.config.MIN_OBSTACLE_GAP, this.config.MAX_OBSTACLE_GAP)
  }

  needToAddObstacle() {
    if (this.gameTime < this.config.BUFFER_TIME) {
      return false
    }
    if (this.currentGap <= 0) {
      return true
    }
    return false
  }

  reset() {
    this.gameTime = 0
    this.groundList = []
    this.lastGround = null

    this.obstacleList = []
    this.currentGap = 0
  }
}

export default GroundManager

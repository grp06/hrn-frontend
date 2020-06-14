import { random } from 'lodash'

import * as React from 'react'
import Cloud from './cloud'

class CloudManager extends React.Component {
  canvas
  canvasCtx
  cloudList
  currentGap = 0
  lastCloud

  config = {
    MIN_CLOUD_AMOUNT: 0,
    MAX_CLOUD_AMOUNT: Infinity,
    MAX_CLOUD_GAP: 0, // this.canvas.width / 1
    MIN_CLOUD_GAP: 0, // this.canvas.width / 4
    CLOUD_FREQUENCY: 0.1,
    CLOUD_CONFIG: {},
  }

  constructor(canvas, options = {}) {
    super(canvas, options)
    if (!canvas) {
      throw new Error('need parameter canvas')
    }
    this.canvas = canvas
    this.canvasCtx = this.canvas.getContext('2d')

    this.config.MAX_CLOUD_GAP = this.canvas.width / 1
    this.config.MIN_CLOUD_GAP = this.canvas.width / 4
    this.config = {
      ...this.config,
      ...options,
    }
  }

  update(deltaTime, speed) {
    if (this.needToAddCloud()) {
      this.addCloud(this.config.CLOUD_CONFIG)
    }
    this.cloudList = this.cloudList.filter((cloud) => cloud && !cloud.remove)
    this.cloudList.forEach((cloud) => cloud.update(deltaTime, speed))
  }

  needToAddCloud() {
    const num = this.cloudList.length
    // cloud collision
    const gapDistance = this.lastCloud
      ? this.canvas.width - this.lastCloud.xPos + this.lastCloud.img.width
      : Infinity
    if (gapDistance < 0) {
      return false
    }
    if (num < this.config.MIN_CLOUD_AMOUNT) {
      return true
    }
    if (num > this.config.MAX_CLOUD_AMOUNT) {
      return false
    }
    if (gapDistance > this.currentGap && this.config.CLOUD_FREQUENCY > Math.random()) {
      return true
    }
    return false
  }

  addCloud(options = {}) {
    const cloud = new Cloud(this.canvas, options)
    this.cloudList.push(cloud)
    this.lastCloud = cloud
    this.currentGap = random(this.config.MIN_CLOUD_GAP, this.config.MAX_CLOUD_GAP)
  }

  reset() {
    this.cloudList = []
    this.currentGap = 0
    this.lastCloud = null
  }
}

export default CloudManager

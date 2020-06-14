import cactusLargeImg from './images/cactus_large.png'
import cactusSmallImg from './images/cactus_small.png'
import cloudImg from './images/cloud.png'
import gameoverTextImg from './images/gameover_text.png'
import groundImg from './images/ground.png'
import restartButtonImg from './images/restart_button.png'
import scoreNumberImg from './images/score_number.png'
import tRexImg from './images/tRex.png'
import tRexCrashImg from './images/trex_crash.png'
import tRexDuck1Img from './images/trex_duck_1.png'
import tRexDuck2Img from './images/trex_duck_2.png'
import tRexFistFrameImg from './images/trex_first_frame.png'

const imageArray = [
  cloudImg,
  tRexImg,
  tRexFistFrameImg,
  groundImg,
  cactusSmallImg,
  cactusLargeImg,
  tRexDuck1Img,
  tRexDuck2Img,
  tRexCrashImg,
  restartButtonImg,
  gameoverTextImg,
  scoreNumberImg,
]

const imageMap = new Map()

const promiseArray = imageArray.map((imgUrl) => {
  const promise = new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = reject
    img.onload = () => {
      imageMap.set(imgUrl, img)
      resolve()
    }
    img.src = imgUrl
  })
  return promise
})

export function loadImages() {
  return Promise.all(promiseArray)
}

export default function getImg(src) {
  const img = imageMap.get(src)
  if (!img) {
    throw new Error(`load image fail! IMG_SRC: ${src}`)
  }
  return img
}

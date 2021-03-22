import React from 'react'
import { motion, useAnimation } from 'framer-motion'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { useVideoRoomStyles } from '.'

export interface MysteryBoxProps {}

const jumpSpin = {
  scale: [1, 2, 2, 1],
  rotate: [0, 0, 360, 360],
  backgroundColor: ['#FF99AD', '#fabb5b', '#FF99AD', '#fabb5b'],
  borderRadius: ['4px', '4px', '50%', '50%'],
}

const rotateAround = {
  rotate: 720,
  rotateY: 720,
}
const MysteryBox: React.FC<MysteryBoxProps> = () => {
  const classes = useVideoRoomStyles()
  const anim = useAnimation()
  return (
    <motion.div
      className={classes.mysteryBox}
      animate={anim}
      onTap={async () => {
        await anim.start(jumpSpin)
        await anim.start(rotateAround)
      }}
      transition={{
        duration: 2.5,
        ease: 'easeInOut',
      }}
    >
      <HelpOutlineIcon fontSize="large" style={{ color: '#000000' }} />
    </motion.div>
  )
}

export default MysteryBox

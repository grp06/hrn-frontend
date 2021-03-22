import React, { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { useVideoRoomStyles } from '.'

export interface MysteryQuestionBoxProps {
  onBoxClick: Function
}

const jumpSpin = {
  scale: [1, 1.5, 1.5, 1],
  rotate: [0, 0, 360, 360],
  backgroundColor: ['#FF99AD', '#fabb5b', '#FF99AD', '#fabb5b'],
  borderRadius: ['4px', '4px', '50%', '50%'],
}

const rotateAround = {
  rotate: 720,
  rotateY: 720,
}

const MysteryQuestionBox: React.FC<MysteryQuestionBoxProps> = ({ onBoxClick }) => {
  const classes = useVideoRoomStyles()
  const [userHasClicked, setUserHasClicked] = useState<boolean>(false)
  const anim = useAnimation()
  return (
    <motion.div
      className={classes.mysteryQuestionBox}
      animate={anim}
      onTap={async () => {
        if (!userHasClicked) {
          await anim.start(jumpSpin)
          await anim.start(rotateAround)
          onBoxClick()
          setUserHasClicked(true)
        }
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

export default MysteryQuestionBox

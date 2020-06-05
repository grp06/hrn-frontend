import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { setPartnerXThumb, setPartnerYThumb } from '../gql/mutations'

const useStyles = makeStyles((theme) => ({
  messageText: {
    ...theme.typography.h2,
    color: theme.palette.common.ghostWhite,
    width: '50%',
    lineHeight: '1.4rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 50,
  },
}))

const ThumbsUp = ({ myRound, userId }) => {
  const classes = useStyles()
  console.log('myRound ->', myRound)
  const [showThumbUpButton, setShowThumbUpButton] = useState(true)

  const [setPartnerXThumbMutation] = useMutation(setPartnerXThumb, {
    variables: {
      round_id: myRound.id,
      partnerX_id: userId,
    },
  })
  const [setPartnerYThumbMutation] = useMutation(setPartnerYThumb, {
    variables: {
      round_id: myRound.id,
      partnerY_id: userId,
    },
  })

  const handleThumbUpClick = () => {
    const iAmPartnerX = myRound.partnerX_id === userId
    if (iAmPartnerX) {
      console.log('partner X Thumb Mutation')
      setPartnerXThumbMutation()
      return setShowThumbUpButton(false)
    }
    setPartnerYThumbMutation()
    return setShowThumbUpButton(false)
  }

  return (
    <div>
      {showThumbUpButton ? (
        <>
          <Typography className={classes.messageText}>
            Hope you had a great chat! Let us know if you vibed with your partner. We can connect
            you two after the event!
          </Typography>
          <Button variant="contained" color="primary" onClick={handleThumbUpClick}>
            Thumbs up Bitch!
          </Button>
        </>
      ) : (
        <>
          <Typography>Thanks for the feedback! Connecting you to a new friend soon!</Typography>
          <div className={classes.emoji}>
            <span>🥳</span>
          </div>
        </>
      )}
    </div>
  )
}

export default ThumbsUp

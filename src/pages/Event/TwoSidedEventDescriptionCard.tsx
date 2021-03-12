import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { motion } from 'framer-motion'
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core'
import { useEventStyles } from '.'
import { Snack } from '../../common'
import { updateEventAttendeesSide } from '../../gql/mutations'
import { sleep } from '../../helpers'
import { UserObjectInterface } from '../../utils'

interface TwoSidedEventDescriptionProps {
  event_id: number
  isEventParticipant: { side: string; user: UserObjectInterface } | undefined
  side_a: string
  side_b: string
  user_id: number
}

const cardVariants = {
  glow: {
    scale: 1.01,
    boxShadow: '0px 0px 4px 4px #FF99AD',
    transition: {
      duration: 2.0,
      yoyo: Infinity,
    },
  },
}

const TwoSidedEventDescription: React.FC<TwoSidedEventDescriptionProps> = ({
  event_id,
  isEventParticipant,
  side_a,
  side_b,
  user_id,
}) => {
  const classes = useEventStyles()
  const [switchSidesButtonLoading, setSwitchSidesButtonLoading] = useState<boolean>(false)
  const [showSuccessSnack, setShowSuccessSnack] = useState<boolean>(false)
  const [errorSnackMessage, setErrorSnackMessage] = useState<string>('')
  const usersSide = isEventParticipant ? isEventParticipant.side : null

  const [updateEventAttendeesSideMutation] = useMutation(updateEventAttendeesSide, {
    onCompleted: (data) => {
      setShowSuccessSnack(true)
      setSwitchSidesButtonLoading(false)
    },
  })

  const handleSwitchSidesClick = async () => {
    setSwitchSidesButtonLoading(true)
    try {
      await sleep(800)
      await updateEventAttendeesSideMutation({
        variables: {
          event_id,
          side: usersSide === 'a' ? 'b' : 'a',
          user_id,
        },
      })
    } catch (err) {
      setSwitchSidesButtonLoading(false)
      setErrorSnackMessage(err)
    }
  }

  const rsvpInfoContent = isEventParticipant ? (
    <>
      <Typography variant="body1" className={classes.currentRSVPStatusTypography}>
        You&apos;re currently RSVPed as a {usersSide === 'a' ? side_a : side_b}
      </Typography>
      <Button
        variant="contained"
        size="medium"
        color="secondary"
        onClick={handleSwitchSidesClick}
        disabled={switchSidesButtonLoading}
        startIcon={
          switchSidesButtonLoading ? <CircularProgress color="secondary" size={20} /> : null
        }
      >
        {!switchSidesButtonLoading ? 'Switch Sides' : 'Loading'}
      </Button>
    </>
  ) : (
    <Typography variant="body1" className={classes.suggestToRSVPTypography}>
      Click the &apos;RSVP&apos; button above and choose your side!
    </Typography>
  )

  return (
    <>
      <motion.div variants={cardVariants} animate="glow" style={{ marginBottom: '24px' }}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={classes.eventAndLobbyContentCard}
          style={{ marginBottom: 0 }}
        >
          <Typography variant="h3" className={classes.eventAndLobbyContentCardTitle}>
            This is a two-sided event{' '}
            <span role="img" aria-label="cat surprised">
              🙀
            </span>
          </Typography>
          <Typography variant="body1">
            Simply put, we split the attendees into two sides and have them match with the opposite
            side. In this event we have:
          </Typography>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            className={classes.sideBreakdownContainer}
          >
            <span role="img" aria-label="girls wrestling">
              🤼‍♀️
            </span>
            <Typography variant="body1">
              <span style={{ fontWeight: 'bold' }}>{side_a}</span> in one corner and
            </Typography>
            <Typography>
              <span style={{ fontWeight: 'bold' }}>{side_b}</span> in the other!
            </Typography>
          </Grid>
          {rsvpInfoContent}
        </Grid>
      </motion.div>
      <Snack
        open={showSuccessSnack}
        onClose={() => setShowSuccessSnack(false)}
        severity="warning"
        duration={3000}
        snackMessage="Switched over to the dark side 😈"
      />
      <Snack
        open={Boolean(errorSnackMessage)}
        onClose={() => setErrorSnackMessage('')}
        severity="error"
        duration={3000}
        snackMessage={errorSnackMessage}
      />
    </>
  )
}

export default TwoSidedEventDescription

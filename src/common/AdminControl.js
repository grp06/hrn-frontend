import React, { useEffect, useContext, useState } from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'
import endpointUrl from '../utils/endpointUrl'

import { OnlineUsers } from '../components'
import { useGameContext } from '../context/useGameContext'
import { deleteRounds, setRoundToZero } from '../gql/mutations'

import { useCreatePairings } from '../hooks'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    display: 'flex',
    maxWidth: 600,
    margin: '0 auto',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1em',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 200,
  },
  input: {
    marginBottom: '1em',
    marginTop: '1em',
  },
  onlineUsers: {
    width: '100%',
    height: '100vh',
  },
  btn: {
    margin: '15px',
  },
}))

const AdminControl = () => {
  const classes = useStyles()
  const { currentRound, eventId } = useGameContext()
  const { createPairings } = useCreatePairings()
  const [deleteRoundsMutation] = useMutation(deleteRounds)
  const [setRoundToZeroMutation] = useMutation(setRoundToZero, {
    variables: {
      id: eventId,
    },
  })

  return (
    <Card className={classes.onlineUsers}>
      <>
        <div className={classes.btn}>
          <Button variant="outlined" onClick={createPairings}>
            {currentRound === 0 ? 'Start Event' : 'Next Round'}
          </Button>
        </div>

        <div className={classes.btn}>
          <Button
            variant="outlined"
            onClick={async () => {
              await deleteRoundsMutation()
              await setRoundToZeroMutation()
              await fetch(`${endpointUrl}/api/rooms/complete-rooms`)
            }}
          >
            Reset rounds/game
          </Button>
        </div>

        <div>
          R0und:
          {currentRound}
        </div>

        <Typography>Online Users</Typography>
        <OnlineUsers />
      </>
    </Card>
  )
}

export default AdminControl

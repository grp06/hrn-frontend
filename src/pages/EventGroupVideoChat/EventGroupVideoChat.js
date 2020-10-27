import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import { GroupVideoChatBottomPanel } from '.'
import {
  useAppContext,
  useEventContext,
  useUserContext,
  useUserEventStatusContext,
} from '../../context'

const useStyles = makeStyles((theme) => ({
  videoBox: {
    width: '95%',
    height: '90vh',
    backgroundColor: 'blue',
    borderRadius: '4px',
    padding: theme.spacing(3),
    overflowY: 'scroll',
    margin: theme.spacing(0, 'auto'),
  },
  box: {
    backgroundColor: 'yellow',
    borderRadius: '4px',
  },
}))

const EventGroupVideoChat = () => {
  const classes = useStyles()
  const { appLoading } = useAppContext()
  const { event } = useEventContext()
  const { user } = useUserContext()
  const { setUserHasEnabledCameraAndMic } = useUserEventStatusContext()
  const { id: user_id } = user

  const getNumRowsAndCols = (numberOfVideos) => {
    const width = numberOfVideos <= 4 ? '49%' : '32%'
    const height = numberOfVideos <= 6 ? '49%' : '32%'
    return { width, height }
  }

  const { width, height } = getNumRowsAndCols(9)

  return (
    <>
      <Grid container justify="space-around" className={classes.videoBox}>
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
        <div className={classes.box} style={{ width, height }} />
      </Grid>
      <GroupVideoChatBottomPanel
        event={event}
        setUserHasEnabledCameraAndMic={setUserHasEnabledCameraAndMic}
        userId={user_id}
      />
    </>
  )
}

export default EventGroupVideoChat

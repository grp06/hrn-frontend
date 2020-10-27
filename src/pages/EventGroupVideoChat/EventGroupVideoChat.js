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
    width: '100%',
    height: '85vh',
    backgroundColor: 'blue',
    borderRadius: '4px',
    padding: theme.spacing(3),
    overflowY: 'scroll',
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
    let width
    let height
    if (numberOfVideos <= 4) {
      width = '50%'
      height = '50%'
    } else {
      width = '33%'
      height = '33%'
    }
    return { width, height }
  }

  const { width, height } = getNumRowsAndCols(5)

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

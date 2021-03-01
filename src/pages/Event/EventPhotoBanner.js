import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'

import mountainBanner from '../../assets/eventBannerMountain.png'
import { ChangeEventPhotoBanner } from '.'

const useStyles = makeStyles((theme) => ({
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    height: 'auto',
    minHeight: '55vh',
    width: '100%',
    position: 'absolute',
    top: '0%',
    bottom: 'auto',
  },
  eventBanner: {
    width: '100%',
    height: 'auto',
    minHeight: '55vh',
    zIndex: '-3',
    marginBottom: '80px',
    backgroundPosition: '50% 50% !important',
    backgroundSize: 'cover !important',
  },
}))

const EventPhotoBanner = ({ bannerPhotoURL, eventId, userIsHost }) => {
  const classes = useStyles()
  const [bannerBackground, setBannerBackground] = useState(
    bannerPhotoURL ? `url("${bannerPhotoURL}")` : `url("${mountainBanner}")`
  )
  const { pathname } = window.location
  const userInLobbyOrEventComplete = Boolean(
    pathname.includes('lobby') || pathname.includes('event-complete')
  )

  return (
    <Grid container style={{ position: 'relative' }}>
      {userIsHost && !userInLobbyOrEventComplete ? (
        <ChangeEventPhotoBanner
          eventId={eventId}
          setBannerBackground={(photo_url) => setBannerBackground(photo_url)}
        />
      ) : null}
      <div
        className={classes.eventBanner}
        style={{
          background: bannerBackground,
        }}
      />
      <div className={classes.bannerGradient} />
    </Grid>
  )
}

export default EventPhotoBanner

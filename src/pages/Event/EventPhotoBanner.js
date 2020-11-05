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
  changeBannerButton: {
    position: 'absolute',
    backgroundColor: 'rgb(36,37,38,0.5)',
    '&:hover': {
      backgroundColor: 'rgb(36,37,38,1)',
    },
    top: 15,
    right: '7.5vw',
    left: 'auto',
    zIndex: 999,
  },
  bannerSearchContainer: {
    position: 'absolute',
    zIndex: 999,
    width: '100%',
  },
  bannerSearchForm: {
    background: 'rgba(0,0,0,.7)',
    width: '50%',
    margin: theme.spacing(0, 'auto'),
    borderRadius: '4px',
    padding: theme.spacing(2),
  },
  searchInput: {
    margin: theme.spacing(2, 0),
  },
}))

const EventPhotoBanner = ({ bannerPhotoURL, event_id, userIsHost }) => {
  const classes = useStyles()
  const [bannerBackground, setBannerBackground] = useState(
    bannerPhotoURL ? `url("${bannerPhotoURL}")` : `url("${mountainBanner}")`
  )

  return (
    <Grid container style={{ position: 'relative' }}>
      {userIsHost ? (
        <ChangeEventPhotoBanner
          event_id={event_id}
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

import React, { useState } from 'react'

import { Grid } from '@material-ui/core'
import { ChangeEventPhotoBanner, useEventStyles } from '.'
import mountainBanner from '../../assets/eventBannerMountain.png'

const EventPhotoBanner = ({ bannerPhotoURL, eventId, userIsHost }) => {
  const classes = useEventStyles()
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
      <div className={classes.eventPhotoBannerGradient} />
    </Grid>
  )
}

export default EventPhotoBanner

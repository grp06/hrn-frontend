import React, { useState } from 'react'

import copy from 'copy-to-clipboard'
import { Avatar, Chip, Grid, Fab, Typography } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { useMyConnectionsStyles } from '.'
import { Snack } from '../../common'
import { AddFriendButton } from '../VideoRoom'

const ConnectionCard = ({ connection, eventId, i_shared_details, partnerId, userId }) => {
  const classes = useMyConnectionsStyles()
  const {
    name,
    city,
    tags_users: connectionsTags,
    short_bio,
    linkedIn_url,
    email,
    profile_pic_url,
  } = connection
  const [showCopyEmailSnack, setShowCopyEmailSnack] = useState(false)
  const myRoundInfo = { event_id: eventId, partner_id: partnerId, user_id: userId }

  const handleCopyEmailClick = () => {
    window.analytics.track('Copied email')
    copy(email)
    return setShowCopyEmailSnack(true)
  }

  const renderConnectionsTags = () => {
    return connectionsTags
      .sort((tagA, tagB) => {
        return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
      })
      .map((tagObject) => {
        const { tag } = tagObject
        return <Chip key={tag.tag_id} label={tag.name} id={tag.tag_id} color="primary" />
      })
  }

  const renderContactButtons = () => {
    return i_shared_details ? (
      <div className={classes.connectionCardButtonContainer}>
        <Fab
          color="inherit"
          size="small"
          aria-label="email button"
          className={classes.circleButton}
          onClick={handleCopyEmailClick}
        >
          <EmailIcon style={{ color: '#FF99AD' }} fontSize="small" />
        </Fab>
        {linkedIn_url && (
          <Fab
            color="inherit"
            size="small"
            aria-label="linkedIn button"
            className={classes.circleButton}
            href={linkedIn_url.includes('http') ? linkedIn_url : `https://${linkedIn_url}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.analytics.track('Clicked LinkedIn Profile')}
          >
            <LinkedInIcon style={{ color: '#FF99AD' }} fontSize="small" />
          </Fab>
        )}
      </div>
    ) : (
      <div className={classes.addFriendButtonContainer}>
        <AddFriendButton myRound={myRoundInfo} />
      </div>
    )
  }

  return (
    <>
      <Grid
        container
        alignItems="center"
        justify="space-around"
        wrap="wrap"
        className={classes.connectionCardContainer}
      >
        <Grid
          container
          item
          alignItems="center"
          justify="flex-start"
          className={classes.connectionAvatarGridContainer}
        >
          {profile_pic_url ? (
            <Avatar src={profile_pic_url} className={classes.connectionAvatarContainer} />
          ) : (
            <Avatar className={classes.connectionAvatarContainer}>
              <img alt="company-logo" className={classes.connectionAvatar} src={logo} />
            </Avatar>
          )}
          <Grid container direction="column" className={classes.cityNameEmailGrid}>
            <Typography variant="h3">{name}</Typography>
            <Typography variant="subtitle1">{city || 'Bikini Bottom 🍍'}</Typography>
            {renderContactButtons()}
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          item
          xs={12}
          className={classes.connectionContentContainer}
        >
          <Grid container wrap="wrap" alignItems="center" className={classes.tagsContainer}>
            {renderConnectionsTags()}
          </Grid>
          <Typography variant="body1" className={classes.shortBioDesc}>
            {short_bio || 'Your connection seems to have forgotten to write about themselves 😧'}
          </Typography>
        </Grid>
      </Grid>
      <Snack
        open={showCopyEmailSnack}
        onClose={() => setShowCopyEmailSnack(false)}
        severity="info"
        duration={1500}
        snackMessage="Copied  💾"
      />
    </>
  )
}

export default ConnectionCard

import React, { useState } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import copy from 'copy-to-clipboard'
import EmailIcon from '@material-ui/icons/Email'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { Snack } from '../../common'
import { AddFriendButton } from '../VideoRoom'

const useStyles = makeStyles((theme) => ({
  addFriendButtonContainer: {
    width: '160px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    marginTop: '19px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
      marginTop: '19px',
    },
  },
  avatarContainer: {
    width: '120px',
    height: '120px',
  },
  avatarGridContainer: {
    height: '120px',
  },
  buttonContainer: {
    paddingTop: theme.spacing(1),
  },
  cardContainer: {
    position: 'relative',
    top: '-40px',
    bottom: '0%',
    display: 'block',
    width: '750px',
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '75px',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(4),
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
  },
  circleButton: {
    border: `2px solid ${theme.palette.common.orchid}`,
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    marginRight: theme.spacing(2),
    width: '35px',
    height: '35px',
  },
  cityNameEmailGrid: {
    height: '100%',
    width: 'auto',
    marginLeft: theme.spacing(3),
  },
  connectionContentContainer: {
    margin: theme.spacing(2, 0),
  },
  shortBioDesc: {
    margin: theme.spacing(2, 0, 1, 0),
  },
  tagsContainer: {
    marginTop: theme.spacing(0.5),
    marginLeft: '-5px',
  },
}))

const ConnectionCard = ({ connection, i_shared_details, partnerId, userId, eventId }) => {
  const classes = useStyles()
  const { name, city, tags_users: connectionsTags, short_bio, linkedIn_url, email } = connection
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
      <div className={classes.buttonContainer}>
        <Fab
          color="inherit"
          size="small"
          aria-label="email button"
          className={classes.circleButton}
          onClick={handleCopyEmailClick}
        >
          <EmailIcon style={{ color: '#e98dd7' }} fontSize="small" />
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
          >
            <LinkedInIcon style={{ color: '#e98dd7' }} fontSize="small" />
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
        className={classes.cardContainer}
      >
        <Grid
          container
          item
          alignItems="center"
          justify="flex-start"
          className={classes.avatarGridContainer}
        >
          <Avatar className={classes.avatarContainer}>
            <img alt="company-logo" className={classes.avatar} src={logo} />
          </Avatar>
          <Grid container direction="column" className={classes.cityNameEmailGrid}>
            <Typography variant="h4">{name}</Typography>
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

import React, { useState } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import copy from 'copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../../assets/logoPurple.svg'
import { Snack } from '../../common'
import { AddFriendButton } from '../VideoRoom'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
    },
  },
  avatarContainer: {
    width: '75px',
    height: '75px',
  },
  avatarGridContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
  },
  addFriendsButtonDiv: {
    width: '60%',
  },
  button: {
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(1, 1),
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(-1),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 'auto'),
      marginBottom: 0,
      justifyContent: 'space-around',
    },
  },
  cardContainer: {
    position: 'relative',
    top: '-40px',
    bottom: '0%',
    display: 'block',
    width: '500px',
    height: 'auto',
    marginBottom: '75px',
    borderRadius: '4px',
    border: '2px solid #3e4042',
    boxShadow: '5px 5px 0 #3e4042',
    backgroundColor: theme.palette.common.greyCard,
    padding: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '85vw',
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  city: {
    marginLeft: theme.spacing(1),
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

  const renderConnectionsTags = () => {
    return connectionsTags
      .sort((tagA, tagB) => {
        return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
      })
      .map((tagObject) => {
        const { tag } = tagObject
        return (
          <Chip key={tag.tag_id} label={tag.name} id={tag.tag_id} color="primary" size="small" />
        )
      })
  }

  const renderContactButtons = () => {
    if (!i_shared_details) {
      return <AddFriendButton myRound={myRoundInfo} />
    } else {
      return (
        <div>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            className={classes.button}
            onClick={handleCopyEmailClick}
          >
            Copy Email
          </Button>
          {linkedIn_url && (
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              className={classes.button}
              href={linkedIn_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </Button>
          )}
        </div>
      )
    }
  }

  const handleCopyEmailClick = () => {
    window.analytics.track('Copied email')
    copy(email)
    return setShowCopyEmailSnack(true)
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
          justify="center"
          md={2}
          xs={12}
          className={classes.avatarGridContainer}
        >
          <Avatar className={classes.avatarContainer}>
            <img alt="company-logo" className={classes.avatar} src={logo} />
          </Avatar>
        </Grid>
        <Grid
          container
          direction="column"
          item
          xs={12}
          className={classes.connectionContentContainer}
        >
          <Typography variant="h4">{name}</Typography>
          <Grid container wrap="wrap" alignItems="center" className={classes.tagsContainer}>
            {renderConnectionsTags()}
          </Grid>
          <Grid container alignItems="center">
            <FeatherIcon icon="map-pin" stroke="#e98dd7" size="20" />
            <Typography variant="subtitle1" className={classes.city}>
              {city || 'Bikini Bottom 🍍'}
            </Typography>
          </Grid>
          <Typography variant="body1" className={classes.shortBioDesc}>
            {short_bio || 'Your connection seems to have forgotten to write about themselves 😧'}
          </Typography>
          <Grid
            container
            item
            // justify="space-between"
            alignItems="center"
            className={classes.buttonContainer}
            md={12}
            sm={5}
            xs={8}
          >
            {renderContactButtons()}
          </Grid>
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

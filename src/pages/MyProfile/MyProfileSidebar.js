import React, { useState, useEffect } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { makeStyles } from '@material-ui/styles'

import { FloatCardNarrow } from '../../common'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { SidebarTags, EditProfileSidebarForm } from '.'

const createStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
    marginTop: '19px',
    [theme.breakpoints.down('md')]: {
      marginTop: '19px',
      width: '100%',
      height: '100%',
    },
  },
  avatarContainer: {
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    width: '50%',
    [theme.breakpoints.down('md')]: {
      width: '50%',
    },
  },
  editProfileButton: {
    margin: theme.spacing(2, 0),
  },
  linkedInIcon: {
    marginTop: theme.spacing(1),
    fontSize: '32px',
    color: '#3176b0',
  },
  shortBio: {
    marginTop: theme.spacing(3),
    width: '75%',
    textAlign: 'center',
  },
}))

const MyProfileSidebar = ({ user, databaseTags }) => {
  const classes = createStyles()
  const history = useHistory()
  const { id: userId, name, city, tags_users: usersTags, short_bio, linkedIn_url } = user
  const [showEditSidebarForm, setShowEditSidebarForm] = useState(false)

  const eventIdInLS = localStorage.getItem('eventId')

  useEffect(() => {
    if (usersTags.length === 0) {
      setShowEditSidebarForm(true)
    }
  }, [])

  const renderSidebarContent = () => {
    return !showEditSidebarForm ? (
      <Grid container direction="column" alignItems="center" justify="center">
        <Typography variant="h2">{name}</Typography>
        <Typography variant="subtitle1">{city}</Typography>
        {linkedIn_url && (
          <Button href={linkedIn_url} target="_blank" rel="noopener noreferrer">
            <LinkedInIcon className={classes.linkedInIcon} />
          </Button>
        )}
        <Typography variant="body1" className={classes.shortBio}>
          {short_bio}
        </Typography>
        {/* <SidebarAchievements /> */}
        <SidebarTags userId={userId} usersTags={usersTags} databaseTags={databaseTags.tags} />
        <Grid
          container
          justify="space-around"
          alignItems="center"
          className={classes.buttonContainer}
        >
          <Button
            variant="contained"
            color="primary"
            className={classes.editProfileButton}
            onClick={() => setShowEditSidebarForm(true)}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!eventIdInLS}
            className={classes.editProfileButton}
            onClick={() => history.push(`/events/${eventIdInLS}`)}
          >
            Back to Event
          </Button>
        </Grid>
      </Grid>
    ) : (
      <EditProfileSidebarForm
        databaseTags={databaseTags}
        onClose={() => setShowEditSidebarForm(false)}
      />
    )
  }

  return (
    <FloatCardNarrow>
      <Grid container direction="column" alignItems="center" justify="center">
        <Avatar className={classes.avatarContainer}>
          <img alt="company-logo" className={classes.avatar} src={logo} />
        </Avatar>
        {renderSidebarContent()}
      </Grid>
    </FloatCardNarrow>
  )
}

export default MyProfileSidebar

import React, { useState, useEffect } from 'react'
import { FloatCardNarrow } from '../../common'
import { makeStyles } from '@material-ui/styles'
import { useHistory } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import logo from '../../assets/logoPurple.svg'
import { SidebarTags, EditProfileSidebarForm } from '.'

const createStyles = makeStyles((theme) => ({
  avatar: {
    width: '145px',
    height: '145px',
    [theme.breakpoints.down('md')]: {
      width: '150px',
      height: '150px',
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
}))

const MyProfileSidebar = ({ user, databaseTags }) => {
  const classes = createStyles()
  const history = useHistory()
  const { userId, name, city, tags_users: usersTags } = user
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
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle1">{city}</Typography>
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

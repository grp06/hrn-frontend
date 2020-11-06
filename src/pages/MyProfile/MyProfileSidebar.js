import React, { useState, useEffect } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { makeStyles } from '@material-ui/styles'

import { motion } from 'framer-motion'

import { FloatCardNarrow } from '../../common'
import { useAppContext } from '../../context'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { SidebarTags, EditProfileSidebarForm } from '.'

const createStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
    },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(0, 0, 0, .7)',
    color: '#fff',
    opacity: 0,
    // transition: '.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  wrap: {
    position: 'relative',
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
  },

  avatarContainer: {
    width: '125px',
    height: '125px',
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
  uploadPhotoTarget: {
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 9999,
    cursor: 'pointer',
  },
  fileForm: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadImageText: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'center',
  },
}))

const MyProfileSidebar = ({ user, databaseTags }) => {
  const classes = createStyles()
  const history = useHistory()
  const { setAppLoading } = useAppContext()

  const {
    id: userId,
    name,
    city,
    tags_users: usersTags,
    short_bio,
    linkedIn_url,
    profile_pic_url,
  } = user
  const [showEditSidebarForm, setShowEditSidebarForm] = useState(false)

  const eventIdInLS = localStorage.getItem('eventId')

  const submitFile = async (e) => {
    setAppLoading(true)
    console.log('submit form')
    e.preventDefault()
    const file = e.target.files
    try {
      if (!file) {
        throw new Error('Select a file first!')
      }
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('userId', userId)
      const response = await fetch(`${process.env.REACT_APP_API_URL}/test-upload`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: formData,
      }).then((res) => res.json())
      console.log('submitFile -> response', response.url)

      window.location.reload()

      // handle success
    } catch (error) {
      window.location.reload()
      console.log('submitFile -> error', error)
      // handle error
    }
  }

  useEffect(() => {
    if (usersTags.length === 0) {
      setShowEditSidebarForm(true)
    }
  }, [])

  const renderSidebarContent = () => {
    return !showEditSidebarForm ? (
      <Grid container direction="column" alignItems="center" justify="center">
        <Typography variant="h3">{name}</Typography>
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
        <div className={classes.wrap}>
          <Avatar className={classes.avatarContainer}>
            <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />

            <motion.div className={classes.overlay} whileHover={{ opacity: 1 }}>
              <form onSubmit={submitFile} className={classes.fileForm}>
                <input
                  type="file"
                  onChange={async (event) => {
                    submitFile(event)
                  }}
                  className={classes.uploadPhotoTarget}
                />

                <span className={classes.uploadImageText}>edit profile picture</span>
              </form>
            </motion.div>
          </Avatar>
        </div>
        {renderSidebarContent()}
      </Grid>
    </FloatCardNarrow>
  )
}

export default MyProfileSidebar

import React, { useState, useEffect } from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useHistory } from 'react-router-dom'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import { makeStyles } from '@material-ui/styles'

import { motion } from 'framer-motion'
import { DropzoneArea } from 'material-ui-dropzone'

import { FloatCardNarrow } from '../../common'
import { useAppContext } from '../../context'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { SidebarTags, EditProfileSidebarForm } from '.'

const createStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
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
  cancelButton: {
    margin: theme.spacing(1.5, 0),
    backgroundColor: theme.palette.common.greyButton,
    color: theme.palette.common.ghostWhite,
    '&:hover': {
      backgroundColor: theme.palette.common.greyButtonHover,
    },
  },
  editProfileButton: {
    margin: theme.spacing(2, 0),
  },
  fileForm: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkedInIcon: {
    marginTop: theme.spacing(1),
    fontSize: '32px',
    color: '#3176b0',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  shortBio: {
    marginTop: theme.spacing(3),
    width: '75%',
    textAlign: 'center',
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
  wrap: {
    position: 'relative',
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
    cursor: 'pointer',
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
  // my-profile, edit-picture, edit-profile
  const [contentState, setContentState] = useState('my-profile')

  const eventIdInLS = localStorage.getItem('eventId')

  const submitProfilePicture = async (file) => {
    if (file.length) {
      setAppLoading(true)
      try {
        if (!file) {
          throw new Error('Select a file first!')
        }
        const formData = new FormData()
        formData.append('file', file[0])
        formData.append('userId', userId)
        console.log('hitting ', `${process.env.REACT_APP_API_URL}/api/upload/get-signed-url`)
        const urlAndFile = await await fetch(
          `${process.env.REACT_APP_API_URL}/api/upload/get-signed-url`,
          {
            method: 'POST',
            body: formData,
          }
        ).then((res) => res.json())

        const newFile = new Blob([new Uint8Array(urlAndFile.data.data)], { type: 'image/jpeg' })

        const res = await fetch(urlAndFile.url, {
          method: 'PUT',
          body: newFile,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Content-Type': file[0].type,
          },
        })

        const url = res.url.split('?')[0]

        await fetch(`${process.env.REACT_APP_API_URL}/api/upload/save-profile-pic-url`, {
          method: 'POST',
          body: JSON.stringify({ userId, url }),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        window.location.reload()
      } catch (error) {
        console.log('submitFile -> error', error)
        window.location.reload()
      }
    }
  }

  useEffect(() => {
    if (usersTags?.length === 0) {
      setContentState('edit-profile')
    }
  }, [usersTags])

  const renderContent = () => {
    switch (contentState) {
      case 'edit-profile':
        return (
          <EditProfileSidebarForm
            databaseTags={databaseTags}
            onClose={() => setContentState('my-profile')}
          />
        )
      case 'edit-picture':
        return (
          <>
            <DropzoneArea
              alertSnackbarProps={{
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
              }}
              acceptedFiles={['image/*']}
              dropzoneText="Drag and drop your favorite selfie 🤳. Or click to choose"
              filesLimit={1}
              maxFileSize={5000000}
              onChange={(file) => submitProfilePicture(file)}
            />
            <Button
              variant="outlined"
              className={classes.cancelButton}
              onClick={() => setContentState('my-profile')}
            >
              Cancel
            </Button>
          </>
        )

      case 'my-profile':
      default:
        return (
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
                onClick={() => setContentState('edit-profile')}
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
        )
    }
  }
  return (
    <FloatCardNarrow>
      <Grid container direction="column" alignItems="center" justify="center">
        <div className={classes.wrap}>
          <Avatar className={classes.avatarContainer}>
            <img alt="company-logo" className={classes.avatar} src={profile_pic_url || logo} />

            <motion.div
              className={classes.overlay}
              whileHover={{ opacity: 1 }}
              onClick={() => setContentState('edit-picture')}
            >
              <span className={classes.uploadImageText}>edit profile picture</span>
            </motion.div>
          </Avatar>
        </div>
        {renderContent()}
      </Grid>
    </FloatCardNarrow>
  )
}

export default MyProfileSidebar

import React, { useState } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import PanoramaIcon from '@material-ui/icons/Panorama'
import { makeStyles } from '@material-ui/styles'
import { useMutation } from 'react-apollo'
import { motion } from 'framer-motion'

import { Snack } from '../../common'
import { updateEventBannerPhoto } from '../../gql/mutations'

const useStyles = makeStyles((theme) => ({
  animateButtonDiv: {
    position: 'absolute',
    top: 15,
    right: '7vw',
    left: 'auto',
    zIndex: 999,
    [theme.breakpoints.down('xs')]: {
      top: 65,
      left: 10,
    },
    borderRadius: '4px',
  },
  bannerSearchForm: {
    position: 'absolute',
    top: 15,
    right: '7vw',
    left: 'auto',
    background: 'rgba(0,0,0,.7)',
    width: '50%',
    margin: theme.spacing(0, 'auto'),
    borderRadius: '4px',
    padding: theme.spacing(2),
    zIndex: 999,
    [theme.breakpoints.down('xs')]: {
      top: 65,
      left: 10,
      width: '85%',
    },
  },
  changeBannerButton: {
    background: 'rgba(0,0,0,.5)',
    '&:hover': {
      background: 'rgba(0,0,0,.7)',
    },
    borderRadius: '4px',
  },
  closeSearchFormButton: {
    position: 'absolute',
    fontWeight: '300',
    top: '2%',
    right: '2%',
    left: 'auto',
    width: '25px',
    height: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  searchInput: {
    margin: theme.spacing(0, 0, 2, 0),
  },
  suggestedSearchTermButton: {
    width: 'auto',
    color: theme.palette.common.ghostWhite,
    margin: theme.spacing(0.5),
    textTransform: 'lowercase',
    fontWeight: '300',
  },
}))

const buttonVariants = {
  shake: {
    rotate: [0, 10, 0, -10, 0, -10, 0, 10, 0],
    border: [
      '0px solid ',
      '3px solid ',
      '3px solid ',
      '3px solid ',
      '3px solid ',
      '3px solid ',
      '3px solid ',
      '3px solid ',
      '0px',
    ],
    borderColor: [
      '#fabb5b',
      '#fabb5b',
      '#fabb5b',
      '#fabb5b',
      '#fabb5b',
      '#fabb5b',
      '#fabb5b',
      '#ffffff00',
    ],
    transition: { duration: 1.3, delay: 1, ease: 'linear' },
  },
}

const ChangeEventPhotoBanner = ({ event_id, setBannerBackground }) => {
  const classes = useStyles()
  const [bannerSearchTerm, setBannerSearchTerm] = useState('community')
  const [searchedImageURL, setSearcedImageURL] = useState(null)
  const [showBannerSearch, setShowBannerSearch] = useState(false)
  const [showChangeBannerButton, setShowChangeBannerButton] = useState(true)
  const [showSavedPhotoSnack, setShowSavedPhotoSnack] = useState(false)

  const [updateEventBannerPhotoMutation] = useMutation(updateEventBannerPhoto)

  const searchUnsplash = async (keyword) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/get-unsplash-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ keyword }),
      })
        .then((response) => response.json())
        .then((data) => {
          setBannerBackground(`url("${data.image.urls.full}")`)
          setSearcedImageURL(data.image.urls.full)
        })
    } catch (error) {
      alert('error seraching for image')
    }
  }

  const closeBannerSearchForm = () => {
    setBannerSearchTerm('community')
    setShowBannerSearch(false)
    setSearcedImageURL(null)
    setShowChangeBannerButton(true)
  }

  const saveEventBannerPhoto = async () => {
    try {
      await updateEventBannerPhotoMutation({
        variables: {
          event_id,
          banner_photo_url: searchedImageURL,
        },
      })
      closeBannerSearchForm()
      setShowSavedPhotoSnack(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSuggestedSearchTermClick = (term) => {
    setBannerSearchTerm(term)
    searchUnsplash(term)
  }

  const renderSuggestedSearchTermButtons = () => {
    const terms = ['art', 'architecture', 'community', 'forest', 'space', 'tech']
    return terms.map((term) => {
      return (
        <div key={term}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            className={classes.suggestedSearchTermButton}
            onClick={() => handleSuggestedSearchTermClick(term)}
          >
            {term}
          </Button>
        </div>
      )
    })
  }

  return (
    <div>
      {showChangeBannerButton ? (
        <motion.div className={classes.animateButtonDiv} variants={buttonVariants} animate="shake">
          <Button
            className={classes.changeBannerButton}
            size="large"
            variant="text"
            disableRipple
            onClick={() => {
              setShowBannerSearch(true)
              setShowChangeBannerButton(false)
            }}
          >
            <Grid container direction="row">
              <PanoramaIcon />
              <Typography variant="body1" style={{ marginLeft: '8px' }}>
                {' '}
                change banner
              </Typography>
            </Grid>
          </Button>
        </motion.div>
      ) : null}
      {showBannerSearch ? (
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={classes.bannerSearchForm}
        >
          <Button
            variant="text"
            size="medium"
            onClick={closeBannerSearchForm}
            className={classes.closeSearchFormButton}
          >
            Close
          </Button>
          <Typography variant="h4">
            Customize your event banner{' '}
            <span role="img" aria-label="paint palette">
              🎨
            </span>
          </Typography>
          <Typography variant="body1">
            A random image based off your search term will be selected. Don&apos;t like the image?
            Just hit search again!
          </Typography>
          <TextField
            id="banner search term"
            required
            fullWidth
            value={bannerSearchTerm}
            className={classes.searchInput}
            onChange={(e) => setBannerSearchTerm(e.target.value)}
          />
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
            style={{ marginBottom: '16px' }}
          >
            {renderSuggestedSearchTermButtons()}
          </Grid>
          <Grid container direction="row" justify="flex-end" alignItems="center">
            {searchedImageURL ? (
              <Button
                size="small"
                variant="contained"
                color="primary"
                disableRipple
                style={{ marginRight: '8px', width: '100px' }}
                onClick={saveEventBannerPhoto}
              >
                Save
              </Button>
            ) : null}
            <Button
              size="small"
              variant="contained"
              color={searchedImageURL ? 'default' : 'primary'}
              disableRipple
              style={{ width: '100px' }}
              onClick={() => searchUnsplash(bannerSearchTerm)}
            >
              {searchedImageURL ? 'search again' : 'search'}
            </Button>
          </Grid>
        </Grid>
      ) : null}
      <Snack
        open={showSavedPhotoSnack}
        onClose={() => setShowSavedPhotoSnack(false)}
        severity="success"
        snackMessage="Banner Updated 🤙"
      />
    </div>
  )
}

export default ChangeEventPhotoBanner

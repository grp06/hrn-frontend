import React, { useState } from 'react'

import { motion } from 'framer-motion'
import { useMutation } from 'react-apollo'
import { Button, Grid, TextField, Typography } from '@material-ui/core'
import PanoramaIcon from '@material-ui/icons/Panorama'

import { useEventStyles } from '.'
import { Snack } from '../../common'
import { getUnsplashImageURL } from '../../helpers'
import { updateEventBannerPhoto } from '../../gql/mutations'

interface ChangeEventPhotoBannerProps {
  eventId: number
  setBannerBackground: Function
}

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

const ChangeEventPhotoBanner: React.FC<ChangeEventPhotoBannerProps> = ({
  eventId,
  setBannerBackground,
}) => {
  const classes = useEventStyles()
  const [bannerSearchTerm, setBannerSearchTerm] = useState<string>('community')
  const [searchedImageURL, setSearchedImageURL] = useState<string>('')
  const [showBannerSearch, setShowBannerSearch] = useState<boolean>(false)
  const [showChangeBannerButton, setShowChangeBannerButton] = useState<boolean>(true)
  const [showSavedPhotoSnack, setShowSavedPhotoSnack] = useState<boolean>(false)

  const [updateEventBannerPhotoMutation] = useMutation(updateEventBannerPhoto)

  const searchUnsplash = async (keyword: string) => {
    try {
      const unsplashRequest = await getUnsplashImageURL(keyword)
      setBannerBackground(`url("${unsplashRequest.image.urls.regular}")`)
      setSearchedImageURL(unsplashRequest.image.urls.regular)
    } catch (error) {
      console.log('error ->', error)
      alert('error seraching for image')
    }
  }

  const closeBannerSearchForm = () => {
    setBannerSearchTerm('community')
    setShowBannerSearch(false)
    setSearchedImageURL('')
    setShowChangeBannerButton(true)
  }

  const saveEventBannerPhoto = async () => {
    try {
      await updateEventBannerPhotoMutation({
        variables: {
          event_id: eventId,
          banner_photo_url: searchedImageURL,
        },
      })
      closeBannerSearchForm()
      setShowSavedPhotoSnack(true)
    } catch (err) {
      console.log(err)
    }
  }

  const handleSuggestedSearchTermClick = (term: string) => {
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
        <motion.div
          className={classes.animateChangeBannerButtonDiv}
          variants={buttonVariants}
          animate="shake"
        >
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

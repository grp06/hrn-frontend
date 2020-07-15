import React, { useState, useEffect } from 'react'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  toggleTagActive: {
    '&.MuiChip-clickable:focus': {
      backgroundColor: theme.palette.common.dankPurp,
    },
  },
  container: {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
  gridItemContainer: {
    marginBottom: '20px',
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.palette.common.ghostWhite,
  },
  tagCategoryHeader: {
    fontWeight: '300px',
    fontFamily: 'Muli',
    fontSize: '0.8rem',
    color: theme.palette.common.ghostWhite,
  },
}))

const OnboardingInterestTagInput = ({ tagsData, value, onChange }) => {
  console.log('value', value)
  const classes = useStyles()
  const [selectedTags, setSelectedTags] = useState(value)

  useEffect(() => {
    onChange(selectedTags)
  }, [selectedTags])

  const toggleTag = (event) => {
    const elementClicked = event.target
    // check to see if we clicked label instead of actual chip
    const tagId =
      elementClicked.className === 'MuiChip-label'
        ? elementClicked.parentElement.id
        : elementClicked.id

    const chipElement =
      elementClicked.className === 'MuiChip-label' ? elementClicked.parentElement : elementClicked

    const tagIndexInArray = selectedTags.indexOf(tagId)

    // user clicked to remove tag
    if (tagIndexInArray >= 0) {
      setSelectedTags((prevTags) => {
        const copiedPrevTags = [...prevTags]
        copiedPrevTags.splice(tagIndexInArray, 1)
        return copiedPrevTags
      })
      return chipElement.classList.remove('MuiChip-colorPrimary', classes.toggleTagActive)
    }

    setSelectedTags((prevTags) => [...prevTags, tagId])
    return chipElement.classList.add('MuiChip-colorPrimary', classes.toggleTagActive)
  }

  const renderBusinessTags = () => {
    const listOfBusinessTags = tagsData.filter((tag) => tag.id >= 201 && tag.id <= 400).sort()
    return listOfBusinessTags.map((businessTag) => {
      return <Chip label={businessTag.name} id={businessTag.id} clickable onClick={toggleTag} />
    })
  }

  const renderSocialTags = () => {
    const listOfSocialTags = tagsData.filter((tag) => tag.id >= 1 && tag.id <= 200)
    return listOfSocialTags.map((socialTag) => {
      return <Chip label={socialTag.name} id={socialTag.id} clickable onClick={toggleTag} />
    })
  }

  return (
    <div>
      <Grid container direction="column" className={classes.container}>
        <Grid item className={classes.gridItemContainer}>
          <Typography className={classes.sectionTitle}>Interests:</Typography>
          <Typography>
            Choose up to 5 that best represent you. Other users who get matched with you will see
            them.
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography className={classes.tagCategoryHeader}>Business</Typography>
          {renderBusinessTags()}
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography className={classes.tagCategoryHeader}>Social</Typography>
          {renderSocialTags()}
        </Grid>
      </Grid>
    </div>
  )
}

export default OnboardingInterestTagInput

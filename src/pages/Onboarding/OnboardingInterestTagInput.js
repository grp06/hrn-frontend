import React, { useCallback, useState, useEffect } from 'react'
import { Grid, Chip, Typography } from '@material-ui/core'
import { Snack } from '../../common'
import { useOnboardingStyles } from '.'

const OnboardingInterestTagInput = ({ tagsData, value, onChange, userId, usersTags }) => {
  const classes = useOnboardingStyles()
  const [selectedTags, setSelectedTags] = useState(usersTags || value)
  const [showTooManyTagsSnack, setShowTooManyTagsSnack] = useState(false)

  // user has tags in database and has clicked to edit their tags
  // change color of these tags to purple
  const toggleAlreadySelectedTags = useCallback(() => {
    const arrayOfSelectedTagsIds = selectedTags?.map((tag) => tag.tag_id)
    const arrayOfDOMElementChips = Array.from(document.getElementsByClassName('MuiChip-root'))
    arrayOfDOMElementChips.forEach((chip) => {
      const indexOfSelectedTagInDOMChips = arrayOfSelectedTagsIds?.indexOf(parseInt(chip.id, 10))

      if (indexOfSelectedTagInDOMChips >= 0) {
        chip.classList.add('MuiChip-colorPrimary', classes.toggleTagActive)
      }
    })
  }, [classes.toggleTagActive, selectedTags])

  useEffect(() => {
    if (usersTags) {
      toggleAlreadySelectedTags()
    }
  }, [toggleAlreadySelectedTags, usersTags])

  useEffect(() => {
    onChange(selectedTags)
  }, [selectedTags]) //eslint-disable-line

  const toggleTag = (event) => {
    const elementClicked = event.target
    // check to see if we clicked label instead of actual chip
    const tagIdFromChip =
      elementClicked.className === 'MuiChip-label'
        ? elementClicked.parentElement.id
        : elementClicked.id

    const chipElement =
      elementClicked.className === 'MuiChip-label' ? elementClicked.parentElement : elementClicked

    const tagIndexInSelectedTagsArray = selectedTags
      .map((tag, idx) => {
        if (tag.tag_id === parseInt(tagIdFromChip, 10)) return idx
        return null
      })
      .filter((foundTag) => foundTag !== null)

    // user clicked to remove tag
    if (tagIndexInSelectedTagsArray.length > 0) {
      setSelectedTags((prevTags) => {
        const copiedPrevTags = [...prevTags]
        copiedPrevTags.splice(tagIndexInSelectedTagsArray[0], 1)
        return copiedPrevTags
      })
      return chipElement.classList.remove('MuiChip-colorPrimary', classes.toggleTagActive)
    }

    if (selectedTags.length >= 10) {
      return setShowTooManyTagsSnack(true)
    }
    setSelectedTags((prevTags) => [
      ...prevTags,
      { tag_id: parseInt(tagIdFromChip, 10), user_id: userId },
    ])
    return chipElement.classList.add('MuiChip-colorPrimary', classes.toggleTagActive)
  }

  const renderTagsByCategory = (category) => {
    const listOfTagsOfGivenCategory = tagsData
      .filter((tag) => tag.category === category)
      .sort((tagA, tagB) => {
        return tagA.name.toLowerCase() > tagB.name.toLowerCase()
      })
    return listOfTagsOfGivenCategory.map((categoryTag) => {
      return (
        <Chip
          key={categoryTag.tag_id}
          label={categoryTag.name}
          id={categoryTag.tag_id}
          clickable
          onClick={toggleTag}
        />
      )
    })
  }

  return (
    <div>
      <Grid container direction="column" className={classes.container}>
        <Grid item className={classes.gridItemContainer}>
          <Typography variant="subtitle1">
            Choose between 3 and 10 tags that best describe you. Other users who get matched with
            you will see them.
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography variant="subtitle2">Professional</Typography>
          {renderTagsByCategory('professional')}
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography variant="subtitle2">Personal</Typography>
          {renderTagsByCategory('personal')}
        </Grid>
      </Grid>
      <Snack
        open={showTooManyTagsSnack}
        onClose={() => setShowTooManyTagsSnack(false)}
        severity="info"
        snackMessage={'Please only choose 10 interests'}
      />
    </div>
  )
}

export default OnboardingInterestTagInput

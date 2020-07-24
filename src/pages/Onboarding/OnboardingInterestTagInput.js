import React, { useState, useEffect } from 'react'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Snack } from '../../common'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  toggleTagActive: {
    '&.MuiChip-clickable:focus': {
      backgroundColor: theme.palette.common.dankPurp,
    },
  },
  container: {
    // padding: theme.spacing(0, 2.5),
  },
  gridItemContainer: {
    marginBottom: theme.spacing(2.5),
  },
}))

const OnboardingInterestTagInput = ({ tagsData, value, onChange, userId, usersTags }) => {
  const classes = useStyles()
  const [selectedTags, setSelectedTags] = useState(usersTags || value)
  const [showTooManyTagsSnack, setShowTooManyTagsSnack] = useState(false)
  console.log('selectedTags ->', selectedTags)
  console.log('tagsData ->', tagsData)

  // user has tags in database and has clicked to edit their tags
  // change color of these tags to purple
  const toggleAlreadySelectedTags = () => {
    const arrayOfSelectedTagsIds = selectedTags.map((tag) => tag.tag_id)
    const arrayOfDOMElementChips = Array.from(document.getElementsByClassName('MuiChip-root'))
    arrayOfDOMElementChips.forEach((chip) => {
      const indexOfSelectedTagInDOMChips = arrayOfSelectedTagsIds.indexOf(parseInt(chip.id, 10))

      if (indexOfSelectedTagInDOMChips >= 0) {
        chip.classList.add('MuiChip-colorPrimary', classes.toggleTagActive)
      }
    })
  }

  useEffect(() => {
    if (usersTags) {
      console.log('getting into toggleAlreadySelectedTags useEffect')
      toggleAlreadySelectedTags()
    }
  }, [usersTags])

  useEffect(() => {
    onChange(selectedTags)
  }, [selectedTags])

  const toggleTag = (event) => {
    const elementClicked = event.target
    // check to see if we clicked label instead of actual chip
    const tagIdFromChip =
      elementClicked.className === 'MuiChip-label'
        ? elementClicked.parentElement.id
        : elementClicked.id

    console.log('tagIdFromChip ->', tagIdFromChip)
    console.log(typeof tagIdFromChip)
    const chipElement =
      elementClicked.className === 'MuiChip-label' ? elementClicked.parentElement : elementClicked

    const tagIndexInSelectedTagsArray = selectedTags
      .map((tag, idx) => {
        // console.log('tag from selectedTags ->', tag)
        console.log('tag in selectedTags', tag)
        if (tag.tag_id === parseInt(tagIdFromChip, 10)) return idx
        return null
      })
      .filter((foundTag) => foundTag !== null)

    console.log('tagIndexInSelectedTagsArray ->', tagIndexInSelectedTagsArray)

    // user clicked to remove tag
    if (tagIndexInSelectedTagsArray.length > 0) {
      console.log('user clicked to remove')
      setSelectedTags((prevTags) => {
        const copiedPrevTags = [...prevTags]
        copiedPrevTags.splice(tagIndexInSelectedTagsArray[0], 1)
        return copiedPrevTags
      })
      return chipElement.classList.remove('MuiChip-colorPrimary', classes.toggleTagActive)
    }

    if (selectedTags.length >= 8) {
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
            Choose up to 8 tags that best describe you. Other users who get matched with you will
            see them.
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography variant="subtitle2">Professional</Typography>
          {renderTagsByCategory('professional')}
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography variant="subtitle2">Personal</Typography>
          {renderTagsByCategory('hobby')}
        </Grid>
      </Grid>
      <Snack
        open={showTooManyTagsSnack}
        onClose={() => setShowTooManyTagsSnack(false)}
        severity="info"
        snackMessage={'Please only choose 8 interests'}
      />
    </div>
  )
}

export default OnboardingInterestTagInput

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
    padding: theme.spacing(0, 2.5),
  },
  gridItemContainer: {
    marginBottom: theme.spacing(2.5),
  },
}))

const OnboardingInterestTagInput = ({ tagsData, value, onChange, userId }) => {
  const classes = useStyles()
  const [selectedTags, setSelectedTags] = useState(value)
  const [showTooManyTagsSnack, setShowTooManyTagsSnack] = useState(false)

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

    const tagIndexInArray = selectedTags
      .map((tag, idx) => {
        if (tag.tag_id === tagId) return idx
        return null
      })
      .filter((foundTag) => foundTag !== null)

    // user clicked to remove tag
    if (tagIndexInArray.length > 0) {
      setSelectedTags((prevTags) => {
        const copiedPrevTags = [...prevTags]
        copiedPrevTags.splice(tagIndexInArray[0], 1)
        return copiedPrevTags
      })
      return chipElement.classList.remove('MuiChip-colorPrimary', classes.toggleTagActive)
    }

    if (selectedTags.length >= 8) {
      return setShowTooManyTagsSnack(true)
    }
    setSelectedTags((prevTags) => [...prevTags, { tag_id: tagId, user_id: userId }])
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
          key={categoryTag.id}
          label={categoryTag.name}
          id={categoryTag.id}
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
            Choose up to 8 interests that best represent you. Other users who get matched with you
            will see them.
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

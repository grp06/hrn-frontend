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
    padding: '0px 20px',
  },
  gridItemContainer: {
    marginBottom: '20px',
  },
  sectionTitle: {
    color: theme.palette.common.ghostWhite,
  },
  tagCategoryHeader: {
    fontWeight: '300px',
    fontFamily: 'Muli',
    fontSize: '0.8rem',
    color: theme.palette.common.ghostWhite,
  },
}))

const OnboardingInterestTagInput = ({ tagsData, value, onChange, userId }) => {
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
          <Typography variant="h5" className={classes.sectionTitle}>
            Interests:
          </Typography>
          <Typography>
            Choose up to 5 that best represent you. Other users who get matched with you will see
            them.
          </Typography>
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography className={classes.tagCategoryHeader}>Professional</Typography>
          {renderTagsByCategory('professional')}
        </Grid>
        <Grid item className={classes.gridItemContainer}>
          <Typography className={classes.tagCategoryHeader}>Hobbies</Typography>
          {renderTagsByCategory('hobby')}
        </Grid>
      </Grid>
    </div>
  )
}

export default OnboardingInterestTagInput

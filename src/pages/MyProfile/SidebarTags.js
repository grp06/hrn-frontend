import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { TagsForm } from '.'

const createStyles = makeStyles((theme) => ({
  sidebarTagsContainer: {
    width: '100%',
    margin: theme.spacing(4, 0),
  },
  tagsContainer: {
    width: '100%',
    margin: theme.spacing(2, 0),
  },
}))

const SidebarTags = ({ userId, usersTags, databaseTags }) => {
  const classes = createStyles()
  console.log('usersTags ->', usersTags)
  console.log('databaseTags ->', databaseTags)

  const renderUserTags = () => {
    if (usersTags.length === 0) {
      return <TagsForm tags={databaseTags} userId={userId} />
    }
    if (usersTags.length > 1) {
      usersTags = usersTags.sort((tagA, tagB) => {
        return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
      })
    }
    return usersTags.map((tagObject) => {
      const { tag } = tagObject
      return <Chip key={tag.id} label={tag.name} id={tag.id} color="primary" clickable />
    })
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.sidebarTagsContainer}
    >
      <Typography variant="subtitle2">TAGS</Typography>
      <Grid container alignItems="center" wrap="wrap" className={classes.tagsContainer}>
        {renderUserTags()}
      </Grid>
    </Grid>
  )
}

export default SidebarTags

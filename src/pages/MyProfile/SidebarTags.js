import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
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
  editTagsIcon: {
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
  },
}))

const SidebarTags = ({ userId, usersTags, databaseTags }) => {
  const classes = createStyles()
  const [showTagsForm, setShowTagsForm] = useState(false)
  console.log('usersTags ->', usersTags)
  console.log('databaseTags ->', databaseTags)

  const renderUserTags = () => {
    if (showTagsForm) {
      return null
    }

    if (usersTags.length === 0) {
      console.log('keep getting into here')
      return setShowTagsForm(true)
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

  const renderTagsForm = () => {
    return showTagsForm ? (
      <TagsForm tags={databaseTags} userId={userId} onClose={() => setShowTagsForm(false)} />
    ) : null
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.sidebarTagsContainer}
    >
      <Grid container item direction="row">
        <Typography variant="subtitle2">TAGS</Typography>
        <div
          onClick={() => setShowTagsForm((prevFormState) => !prevFormState)}
          className={classes.editTagsIcon}
        >
          <FeatherIcon icon="edit-3" stroke="#fabb5b" size="20" />
        </div>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="center"
        wrap="wrap"
        className={classes.tagsContainer}
      >
        {renderUserTags()}
        {renderTagsForm()}
      </Grid>
    </Grid>
  )
}

export default SidebarTags

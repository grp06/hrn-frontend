import React, { useState } from 'react'
import { Grid, Chip } from '@material-ui/core'
import { TagsForm, useMyProfileStyles } from '.'

const SidebarTags = ({ userId, usersTags, databaseTags }) => {
  const classes = useMyProfileStyles()
  const [showTagsForm, setShowTagsForm] = useState(false)

  const renderUserTags = () => {
    if (showTagsForm) {
      return null
    }

    if (usersTags?.length === 0) {
      return setShowTagsForm(true)
    }

    if (usersTags?.length > 1) {
      usersTags = usersTags.sort((tagA, tagB) => {
        return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
      })
    }
    return usersTags.map((tagObject) => {
      const { tag } = tagObject
      return <Chip key={tag.tag_id} label={tag.name} id={tag.id} color="primary" clickable />
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
      <Grid
        container
        alignItems="center"
        justify="center"
        wrap="wrap"
        className={classes.sidebarTagsWrapper}
      >
        {renderUserTags()}
        {renderTagsForm()}
      </Grid>
    </Grid>
  )
}

export default SidebarTags

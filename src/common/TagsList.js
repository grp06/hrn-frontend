import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import Chip from '@material-ui/core/Chip'

const useStyles = makeStyles((theme) => ({
  tagsListContainer: {
    paddingTop: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(1),
  },
}))

const TagsList = ({ tagsData }) => {
  console.log('TagsList -> tagsData', tagsData)
  const classes = useStyles()

  return (
    <Grid container alignItems="center" direction="row" className={classes.tagsListContainer}>
      {tagsData.tags_users.map((tag) => {
        return (
          <Chip
            label={tag.tag.name}
            color="primary"
            className={classes.chip}
            onDelete={() => console.log('hi')}
          />
        )
      })}
    </Grid>
  )
}
export default TagsList

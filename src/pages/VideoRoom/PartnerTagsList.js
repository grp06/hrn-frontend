import React from 'react'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from 'react-apollo'

import { getTagsByUserId } from '../../gql/queries'

const useStyles = makeStyles((theme) => ({
  tagsContainer: {
    margin: theme.spacing(1.5, 'auto', 0, 'auto'),
    padding: theme.spacing(0, 1),
  },
}))

const PartnerTagsList = ({ myRound, userId }) => {
  const classes = useStyles()
  const remoteVideoDiv = document.getElementById('remote-video')
  const partnerVideoDivExists = remoteVideoDiv && remoteVideoDiv.innerHTML

  return partnerVideoDivExists && myRound.userByPartnerId.tags_users.length > 0 ? (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      wrap="wrap"
      className={classes.tagsContainer}
    >
      {myRound.userByPartnerId.tags_users
        .sort((tagA, tagB) => {
          return tagA.tag.name.length < tagB.tag.name.length
        })
        .map((tagObject) => {
          const { tag } = tagObject
          return <Chip key={tag.tag_id} label={tag.name} id={tag.tag_id} color="primary" />
        })}
    </Grid>
  ) : null
}
export default PartnerTagsList

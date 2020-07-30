import React from 'react'

import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/styles'
import { useQuery } from 'react-apollo'

import { getTagsByUserId } from '../../gql/queries'

const useStyles = makeStyles((theme) => ({}))

const PartnerTagsList = ({ myRound, userId }) => {
  const classes = useStyles()
  const myPartnerId = myRound.partnerX_id === userId ? myRound.partnerY_id : myRound.partnerX_id

  const { data: tagsData, loading: tagsDataLoading } = useQuery(getTagsByUserId, {
    variables: {
      user_id: myPartnerId,
    },
  })
  return !tagsDataLoading && tagsData && tagsData.tags_users.length > 0 ? (
    <Grid
      container
      alignItems="center"
      justify="center"
      wrap="wrap"
      className={classes.tagsContainer}
    >
      {tagsData.tags_users
        .sort((tagA, tagB) => {
          return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
        })
        .map((tagObject) => {
          const { tag } = tagObject
          return (
            <Chip key={tag.tag_id} label={tag.name} id={tag.tag_id} color="primary" clickable />
          )
        })}
    </Grid>
  ) : null
}
export default PartnerTagsList

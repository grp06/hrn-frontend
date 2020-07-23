import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery } from 'react-apollo'
import Chip from '@material-ui/core/Chip'
import { getTagsByUserId } from '../../gql/queries'
import FloatCardMedium from '../FloatCards/FloatCardMedium'

const useStyles = makeStyles((theme) => ({
  tagsContainer: {
    width: '100%',
  },
  nameAndLocation: {
    textAlign: 'center',
    margin: theme.spacing(2, 0),
  },
  wrapper: {
    marginTop: '200px',
  },
  floatCardInnerWrapper: {
    padding: theme.spacing(2),
  },
}))

const PartnerPreview = ({ myRound, userId, event }) => {
  console.log('PartnerPreview -> myRound', myRound)
  const classes = useStyles()
  const myPartnerId = myRound.partnerX_id === userId ? myRound.partnerY_id : myRound.partnerX_id

  const myPartner = myRound.partnerX_id === myPartnerId ? myRound.partnerX : myRound.partnerY

  const { name, city } = myPartner
  const { data: tagsData, loading: tagsDataLoading } = useQuery(getTagsByUserId, {
    variables: {
      user_id: myPartnerId,
    },
  })

  const renderUserTags = () => {
    if (!tagsDataLoading) {
      return tagsData.tags_users.length > 0 ? (
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
              return <Chip key={tag.id} label={tag.name} id={tag.id} color="primary" clickable />
            })}
        </Grid>
      ) : null
    }
  }

  if (myRound.round_number !== event.current_round) {
    return null
  }

  return (
    <Grid className={classes.wrapper}>
      <FloatCardMedium>
        <Grid container direction="column" className={classes.floatCardInnerWrapper}>
          <Grid container item justify="center">
            <Typography variant="h1">Next up:</Typography>
          </Grid>
          <Grid
            item
            container
            justify="center"
            alignItems="center"
            className={classes.nameAndLocation}
          >
            <Typography variant="h5">
              {name}
              {city ? ',' : ''} {city}
            </Typography>
          </Grid>

          {renderUserTags()}
        </Grid>
      </FloatCardMedium>
    </Grid>
  )
}

export default PartnerPreview

import React from 'react'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../../context/useAppContext'
import { getTagsByUserId } from '../../gql/queries'
import { Loading, TagsList } from '../../common'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '100px',
    paddingLeft: '25px',
    paddingRight: '25px',
    margin: '0 auto',
  },
  myTags: {
    paddingTop: theme.spacing(2),
    color: theme.palette.common.ghostWhite,
  },
}))

const MyProfile = () => {
  const classes = useStyles()

  const { app, user } = useAppContext()
  const { userId } = user
  const { appLoading } = app

  const { data: tagsData, loading: tagsLoading } = useQuery(getTagsByUserId, {
    variables: {
      user_id: userId,
    },
    skip: !userId,
  })
  if (appLoading || tagsLoading) {
    return <Loading />
  }
  console.log('tagsData = ', tagsData)
  return (
    <Grid container direction="column" className={classes.pageContainer} md={8} xs={12}>
      <Grid item>
        <Typography variant="h1">My Profile</Typography>
        <Typography variant="subtitle1">
          Fill out some info so we can connect you with the right people
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h2" className={classes.myTags}>
          My Tags
        </Typography>
        <Typography variant="subtitle1">
          Choose up to 5 tags. Tags are displayed over your video when you connect to new
          conversation partners
        </Typography>
        <TagsList tagsData={tagsData} />
      </Grid>
    </Grid>
  )
}

export default MyProfile

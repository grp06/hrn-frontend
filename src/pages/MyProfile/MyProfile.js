import React from 'react'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../../context/useAppContext'
import { getTagsByUserId } from '../../gql/queries'
import { Loading, TagsList } from '../../common'
import { MyProfileSidebar } from '.'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '150px',
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
    <Grid
      container
      className={classes.pageContainer}
      alignItems="flex-start"
      justify="space-around"
    >
      <Grid item>
        <MyProfileSidebar user={user} />
      </Grid>
    </Grid>
  )
}

export default MyProfile

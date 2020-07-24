import React from 'react'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useAppContext } from '../../context/useAppContext'
import { getAllTags } from '../../gql/queries'
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

  const { data: databaseTags, loading: databaseTagsLoading } = useQuery(getAllTags)

  if (appLoading || databaseTagsLoading) {
    return <Loading />
  }

  return (
    <Grid
      container
      className={classes.pageContainer}
      alignItems="flex-start"
      justify="space-around"
    >
      <Grid item>
        <MyProfileSidebar user={user} databaseTags={databaseTags} />
      </Grid>
    </Grid>
  )
}

export default MyProfile

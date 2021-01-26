import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'
import { useAppContext, useUserContext } from '../../context'
import { getAllTags } from '../../gql/queries'
import { Loading } from '../../common'
import { MyProfileSidebar } from '.'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '150px',
  },
}))

const MyProfile = () => {
  const classes = useStyles()
  const { user } = useUserContext()
  const { appLoading } = useAppContext()
  const { id: userId } = user

  // ! Remove after we migrate the pivot app to another project
  const { data: databaseTags = { tags: [] }, loading: databaseTagsLoading } = useQuery(
    getAllTags,
    {}
  )

  useEffect(() => {
    window.analytics.page('/my-profile')
  }, [])

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

import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Grid } from '@material-ui/core'
import { useAppContext, useUserContext } from '../../context'
import { getAllTags } from '../../gql/queries'
import { Loading } from '../../common'
import { MyProfileSidebar, useMyProfileStyles } from '.'

const MyProfile = () => {
  const classes = useMyProfileStyles()
  const { user } = useUserContext()
  const { appLoading } = useAppContext()

  const { data: databaseTags, loading: databaseTagsLoading } = useQuery(getAllTags)

  useEffect(() => {
    window.analytics.page('/my-profile')
  }, [])

  if (appLoading || databaseTagsLoading) {
    return <Loading />
  }

  return (
    <Grid
      container
      className={classes.myProfileContainer}
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

import React, { useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { Grid } from '@material-ui/core'
import { useUserContext } from '../../context'
import { getAllTags } from '../../gql/queries'
import { Loading } from '../../common'
import { MyProfileSidebar, useMyProfileStyles } from '.'

const MyProfile = () => {
  const classes = useMyProfileStyles()
  const { user, userContextLoading } = useUserContext()

  const { data: databaseTags } = useQuery(getAllTags)
  console.log('🚀 ~ MyProfile ~ databaseTags', databaseTags)

  useEffect(() => {
    window.analytics.page('/my-profile')
  }, [])

  if (userContextLoading || !databaseTags) {
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

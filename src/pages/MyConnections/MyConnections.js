import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { getAllMyConnections } from '../../gql/queries'
import { useAppContext, useUserContext } from '../../context'
import { ConnectionCard } from '.'
import { FloatCardLarge, Loading } from '../../common'

const useStyles = makeStyles((theme) => ({
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  nullDataSub: {
    textAlign: 'center',
  },
  pageContainer: {
    marginTop: '150px',
  },
}))

const MyConnections = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const { data: allMyConnectionsData, loading: allMyConnectionsDataLoading } = useQuery(
    getAllMyConnections,
    {
      variables: {
        user_id: userId,
      },
    }
  )

  useEffect(() => {
    window.analytics.page('/my-connections')
  }, [])

  if (appLoading || allMyConnectionsDataLoading) {
    return <Loading />
  }

  const handleGoToPublicEventsClick = () => {
    return history.push('/events')
  }

  const renderNullDataText = () => {
    if (!allMyConnectionsData || !allMyConnectionsData.rounds.length) {
      return (
        <>
          <FloatCardLarge>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              className={classes.nullDataContainer}
            >
              <Typography variant="h4" className={classes.nullDataHeader}>
                Looks like you haven&apos;t connected with anyone yet{' '}
                <span role="img" aria-label="neutral face">
                  😐
                </span>
              </Typography>
              <Typography variant="h6" className={classes.nullDataSub}>
                Join one of our public events and connect with other awesome people!
              </Typography>
              <Button
                onClick={handleGoToPublicEventsClick}
                color="primary"
                variant="contained"
                style={{ marginTop: '20px' }}
              >
                Take Me There!
              </Button>
            </Grid>
          </FloatCardLarge>
        </>
      )
    }
  }

  // TODO: make this its own util function
  // It looks hairy below  because we need to filter between partnerX and partnerY to
  // remove your info, and then make sure we are not returning duplicate connections
  // Ideally this is its own util function that doesnt use the useMutation hook
  // so we dont need to import React
  const arrayOfUniqueConnectionsIds = []

  const arrayOfMyAllMyUniqueConnections = allMyConnectionsData.rounds
    .map((round) => {
      return Object.values(round).filter((person) => person.id !== userId)
    })
    .map((personArray) => {
      const personsId = personArray[0].id
      if (arrayOfUniqueConnectionsIds.indexOf(personsId) === -1) {
        arrayOfUniqueConnectionsIds.push(personsId)
        return personArray[0]
      }
      return null
    })
    .filter((el) => el !== null)

  const renderConnectionCards = () => {
    if (arrayOfMyAllMyUniqueConnections.length) {
      return arrayOfMyAllMyUniqueConnections.map((connection) => {
        return <ConnectionCard key={connection.id} connection={connection} />
      })
    }
  }

  return (
    <div className={classes.pageContainer}>
      {renderNullDataText()}
      {renderConnectionCards()}
    </div>
  )
}

export default MyConnections

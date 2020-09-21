import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
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
    marginTop: '100px',
    paddingLeft: '25px',
    paddingRight: '25px',
  },
  sectionHeader: {
    marginBottom: theme.spacing(3),
  },
  toggleSelect: {
    color: theme.palette.common.ghostWhite,
    borderLeft: 'none',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: `2px solid ${theme.palette.common.dankPurp}`,
  },
  toggleUnSelect: {
    color: theme.palette.common.ghostWhite,
    borderLeft: 'none',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: `2px solid ${theme.palette.common.ghostWhite}`,
  },
}))

const MyConnections = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const [friendsToggle, setFriendsToggle] = React.useState(true)
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
    if (!allMyConnectionsData || !allMyConnectionsData.partners.length) {
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

  let iSharedConnections, notSharedConnections
  if (allMyConnectionsData && allMyConnectionsData.partners.length > 0) {
    iSharedConnections = allMyConnectionsData.partners.filter(
      (partner) => !!partner.i_shared_details
    )
    notSharedConnections = allMyConnectionsData.partners.filter(
      (partner) => !partner.i_shared_details
    )
  }

  const renderAllMyConnection = () => {
    if (allMyConnectionsData && allMyConnectionsData.partners.length > 0) {
      if (!!friendsToggle) {
        return iSharedConnections.map((partner) => (
          <ConnectionCard
            key={partner.id}
            connection={partner.userByPartnerId}
            i_shared_details={partner.i_shared_details}
            partnerId={partner.partner_id}
            userId={partner.user_id}
            eventId={partner.event_id}
          />
        ))
      } else {
        return notSharedConnections.map((partner) => (
          <ConnectionCard
            key={partner.id}
            connection={partner.userByPartnerId}
            i_shared_details={partner.i_shared_details}
            partnerId={partner.partner_id}
            userId={partner.user_id}
            eventId={partner.event_id}
          />
        ))
      }
    }
  }

  const handleFriendsConnectionToggle = (event) => {
    if (event.currentTarget.value === 'friends') {
      setFriendsToggle(true)
      console.log('selected')
    } else if (event.currentTarget.value === 'requests') {
      setFriendsToggle(false)
      console.log('selected')
    }
  }

  return (
    <div className={classes.pageContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Connections:
      </Typography>
      <ToggleButtonGroup value={friendsToggle} exclusive onChange={handleFriendsConnectionToggle}>
        <ToggleButton
          value="friends"
          className={friendsToggle ? classes.toggleSelect : classes.toggleUnSelect}
        >
          Friends
        </ToggleButton>
        <ToggleButton
          value="requests"
          className={friendsToggle ? classes.toggleSelect : classes.toggleUnSelect}
        >
          Requests
        </ToggleButton>
      </ToggleButtonGroup>
      <div className={classes.pageContainer}>
        {renderNullDataText()}
        {renderAllMyConnection()}
      </div>
    </div>
  )
}

export default MyConnections

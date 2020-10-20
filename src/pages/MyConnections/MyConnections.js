import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useSubscription } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { listenToAllMyConnections } from '../../gql/subscriptions'
import { useAppContext, useUserContext } from '../../context'
import { ConnectionCard } from '.'
import { FloatCardLarge, Loading } from '../../common'

const useStyles = makeStyles((theme) => ({
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(1),
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
    textAlign: 'center',
    margin: theme.spacing(0, 'auto', 3, 'auto'),
  },
  toggleButtonActive: {
    width: '125px',
    '&.Mui-selected': {
      color: theme.palette.common.basePink,
      borderRadius: 0,
      border: 'none',
      borderBottom: `2px solid ${theme.palette.common.basePink}`,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  toggleButtonInactive: {
    width: '125px',
    color: theme.palette.common.ghostWhite,
    borderRadius: 0,
    border: 'none',
    borderBottom: '2px solid #3e4042',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 'auto', 12, 'auto'),
  },
}))

const MyConnections = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const [connectionToggleValue, setConnectionToggleValue] = React.useState('friends')
  const { data: allMyConnectionsData, loading: allMyConnectionsDataLoading } = useSubscription(
    listenToAllMyConnections,
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

  const renderNullDataText = (message) => {
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
              {message}
            </Typography>
            <Typography variant="h4" className={classes.nullDataSub}>
              Join one of our public events and connect with other awesome people!
            </Typography>
            <Button
              onClick={handleGoToPublicEventsClick}
              color="primary"
              size="large"
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

  const renderContactCards = (contactGroup, emptyGroupMessage) => {
    if (allMyConnectionsData && allMyConnectionsData.partners.length) {
      const group =
        contactGroup === 'friends'
          ? allMyConnectionsData.partners
              .filter((partner) => !!partner.i_shared_details)
              .sort((partnerA, partnerB) =>
                partnerA.partner.name
                  .toLowerCase()
                  .localeCompare(partnerB.partner.name.toLowerCase())
              )
          : allMyConnectionsData.partners
              .filter((partner) => !partner.i_shared_details)
              .sort((partnerA, partnerB) =>
                partnerA.partner.name
                  .toLowerCase()
                  .localeCompare(partnerB.partner.name.toLowerCase())
              )

      if (group.length > 0) {
        return group.map((partner) => (
          <ConnectionCard
            key={partner.id}
            connection={partner.partner}
            i_shared_details={partner.i_shared_details}
            partnerId={partner.partner_id}
            userId={partner.user_id}
            eventId={partner.event_id}
          />
        ))
      }
      return renderNullDataText(emptyGroupMessage)
    }
    return renderNullDataText(emptyGroupMessage)
  }

  const handleConnectionToggle = (event) => {
    setConnectionToggleValue(event.currentTarget.value)
  }

  return (
    <div className={classes.pageContainer}>
      <Typography variant="h1" className={classes.sectionHeader}>
        Connections
      </Typography>
      <div className={classes.pageContainer}>
        <Grid container justify="center" alignItems="center">
          <ToggleButtonGroup
            value={connectionToggleValue}
            exclusive
            onChange={handleConnectionToggle}
            className={classes.toggleButtonGroup}
          >
            <ToggleButton
              value="friends"
              disableRipple
              className={
                connectionToggleValue === 'friends'
                  ? classes.toggleButtonActive
                  : classes.toggleButtonInactive
              }
            >
              Friends
            </ToggleButton>
            <ToggleButton
              value="requests"
              disableRipple
              className={
                connectionToggleValue === 'requests'
                  ? classes.toggleButtonActive
                  : classes.toggleButtonInactive
              }
            >
              Requests
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid container direction="column" justify="center" alignItems="center">
          {connectionToggleValue === 'friends'
            ? renderContactCards('friends', "Looks like you haven't connected with anyone yet 😢")
            : renderContactCards('requests', "You don't have any requests to respond to 😎")}
        </Grid>
      </div>
    </div>
  )
}

export default MyConnections

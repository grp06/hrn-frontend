import React, { useEffect } from 'react'
import { useSubscription } from 'react-apollo'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { ConnectionCard, useMyConnectionsStyles } from '.'
import { FloatCardMedium, Loading } from '../../common'
import { useAppContext, useUserContext } from '../../context'
import { listenToAllMyConnections } from '../../gql/subscriptions'

const MyConnections = () => {
  const classes = useMyConnectionsStyles()
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
        <FloatCardMedium>
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
        </FloatCardMedium>
      </>
    )
  }

  const renderContactCards = (contactGroup, emptyGroupMessage) => {
    if (allMyConnectionsData?.partners.length) {
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
    <>
      <Grid container>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.myConnectionsPageBanner}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h1">My Connections</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="flex-start" alignItems="center" className={classes.toggleGrid}>
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
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.myConnectionsContainer}
      >
        {connectionToggleValue === 'friends'
          ? renderContactCards('friends', "Looks like you haven't connected with anyone yet 😢")
          : renderContactCards('requests', "You don't have any requests to respond to 😎")}
      </Grid>
    </>
  )
}

export default MyConnections

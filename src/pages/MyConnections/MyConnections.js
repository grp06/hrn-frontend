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
  connectionGrid: {
    margin: theme.spacing(0, 'auto'),
    [theme.breakpoints.down('xl')]: {
      width: '93%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
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
  toggleButtonActive: {
    '&.Mui-selected': {
      color: theme.palette.common.orchid,
      borderRadius: 0,
      border: 'none',
      borderBottom: `2px solid ${theme.palette.common.orchid}`,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  toggleButtonInactive: {
    color: theme.palette.common.ghostWhite,
    borderRadius: 0,
    border: 'none',
    borderBottom: '2px solid #3e4042',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}))

const MyConnections = () => {
  const classes = useStyles()
  const history = useHistory()
  const { appLoading } = useAppContext()
  const { user } = useUserContext()
  const { id: userId } = user
  const [connectionToggleValue, setConnectionToggleValue] = React.useState('friends')
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

  const renderContactCards = (contactGroup, emptyGroupMessage) => {
    if (allMyConnectionsData && allMyConnectionsData.partners.length) {
      const group =
        contactGroup === 'friends'
          ? allMyConnectionsData.partners.filter((partner) => !!partner.i_shared_details)
          : allMyConnectionsData.partners.filter((partner) => !partner.i_shared_details)

      if (group.length > 0) {
        return group.map((partner) => (
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
      return renderNullDataText(emptyGroupMessage)
    }
    return renderNullDataText(emptyGroupMessage)
  }

  const handleConnectionToggle = (event) => {
    setConnectionToggleValue(event.currentTarget.value)
  }

  return (
    <div className={classes.pageContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Connections:
      </Typography>
      <ToggleButtonGroup value={connectionToggleValue} exclusive onChange={handleConnectionToggle}>
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
      <div className={classes.pageContainer}>
        <Grid container justify="space-between" className={classes.connectionGrid}>
          {connectionToggleValue === 'friends'
            ? renderContactCards('friends', "Looks like you haven't connected with anyone yet 😢")
            : renderContactCards('requests', 'You don\t have any requests to respond to 😎')}
        </Grid>
      </div>
    </div>
  )
}

export default MyConnections

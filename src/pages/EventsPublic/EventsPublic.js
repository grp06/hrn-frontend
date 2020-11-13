import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { getAllPublicEvents } from '../../gql/queries'
import blurryBackground from '../../assets/blurryBackground.png'
import { isEventInFuture, getEventStartedOver24HoursAgo } from '../../utils'
import { FloatCardLarge, EventCard, Loading } from '../../common'
import { useEventContext } from '../../context'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
  },
  pageBanner: {
    width: '100%',
    height: '30vh',
    backgroundImage: `url(${blurryBackground})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
  pageBannerContentContainer: {
    margin: theme.spacing(0, 'auto', 1.5, 'auto'),
    width: '70%',
  },
  toggleGrid: {
    width: '70%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  toggleButtonActive: {
    width: '200px',
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
    width: '200px',
    color: theme.palette.common.ghostWhite,
    borderRadius: 0,
    border: 'none',
    // borderBottom: '2px solid #3e4042',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 0, 12, 0),
  },
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    textAlign: 'center',
  },
}))

const EventsPublic = () => {
  const classes = useStyles()
  const { setEventId, resetEvent } = useEventContext()
  const [eventToggleValue, setEventToggleValue] = React.useState('HRN')

  const { data: allPublicEventsData, loading: allPublicEventsDataLoading } = useQuery(
    getAllPublicEvents,
    {}
  )

  useEffect(() => {
    localStorage.setItem('eventId', '')
    localStorage.setItem('event', '')
    setEventId(null)
    resetEvent()
  }, [])

  if (allPublicEventsDataLoading) {
    return <Loading />
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
          </Grid>
        </FloatCardLarge>
      </>
    )
  }

  const EventPublicRegex = /^Hi\sRight\sNow/
  const renderEventsCards = (eventGroup, emptyGroupMessage) => {
    if (allPublicEventsData && allPublicEventsData.events.length) {
      const group =
        eventGroup === 'HRN'
          ? allPublicEventsData.events
              .filter((event) => {
                const eventStartedOver24HoursAgo = getEventStartedOver24HoursAgo(event.start_at)
                return (
                  event.event_name.match(EventPublicRegex) &&
                  !event.ended_at &&
                  !eventStartedOver24HoursAgo
                )
              })
              .sort((eventA, eventB) => {
                if (eventA && eventB) {
                  if (Date.parse(eventB.start_at) < Date.parse(eventA.start_at)) {
                    return 1
                  }
                  return -1
                }
              })
          : allPublicEventsData.events
              .filter((event) => {
                const eventStartedOver24HoursAgo = getEventStartedOver24HoursAgo(event.start_at)
                return (
                  !event.event_name.match(EventPublicRegex) &&
                  !event.ended_at &&
                  !eventStartedOver24HoursAgo
                )
              })
              .sort((eventA, eventB) => {
                if (eventA && eventB) {
                  if (Date.parse(eventB.start_at) < Date.parse(eventA.start_at)) {
                    return 1
                  }
                  return -1
                }
              })

      if (group.length > 0) {
        return group.map((event) => (
          <div style={{ marginBottom: '75px' }}>
            <EventCard key={event.id} event={event} />
          </div>
        ))
      }
      return renderNullDataText(emptyGroupMessage)
    }
    return renderNullDataText(emptyGroupMessage)
  }

  const handleEventToggle = (event) => {
    setEventToggleValue(event.currentTarget.value)
  }

  return (
    <>
      <Grid container>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.pageBanner}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h1">All Events</Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justify="flex-start" alignItems="center" className={classes.toggleGrid}>
        <ToggleButtonGroup
          value={eventToggleValue}
          groupedTextHorizontal
          exclusive
          onChange={handleEventToggle}
          className={classes.toggleButtonGroup}
        >
          <ToggleButton
            value="HRN"
            disableRipple
            className={
              eventToggleValue === 'HRN' ? classes.toggleButtonActive : classes.toggleButtonInactive
            }
          >
            Hi Right Now Events
          </ToggleButton>
          <ToggleButton
            value="OthersEvent"
            disableRipple
            className={
              eventToggleValue === 'OthersEvent'
                ? classes.toggleButtonActive
                : classes.toggleButtonInactive
            }
          >
            All Events
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        {eventToggleValue === 'HRN'
          ? renderEventsCards('HRN', 'Looks like No Hi Right Now Events yet 😢')
          : renderEventsCards('OthersEvent', 'Looks like No Events yet 😢')}
      </Grid>
    </>
  )
}

export default EventsPublic

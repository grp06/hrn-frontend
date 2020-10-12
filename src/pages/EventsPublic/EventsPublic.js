import React, { useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { getAllPublicEvents } from '../../gql/queries'
import bannerBackground5 from '../../assets/purpleOil.jpg'
import { isEventInFuture } from '../../utils'
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
  bannerGradient: {
    background:
      'linear-gradient(0deg, rgba(25,25,25,1) 0%, rgba(0,0,0,0) 58%, rgba(0,212,255,0) 100%)',
    width: '100%',
    height: '100%',
  },
  pageBanner: {
    width: '100%',
    height: '30vh',
    backgroundImage: `url(${bannerBackground5})`,
    backgroundPosition: '50% 50%',
    backgroundSize: 'cover',
    marginBottom: '40px',
  },
  pageBannerContentContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
    textAlign: 'center',
  },
  toggleButtonActive: {
    width: '200px',
    '&.Mui-selected': {
      color: theme.palette.common.orchid,
      borderRadius: 0,
      border: 'none',
      borderBottom: `2px solid ${theme.palette.common.orchid}`,
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
    borderBottom: '2px solid #3e4042',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toggleButtonGroup: {
    margin: theme.spacing(0, 'auto', 12, 'auto'),
  },
  nullDataContainer: {
    padding: theme.spacing(5),
  },
  nullDataHeader: {
    marginBottom: theme.spacing(4),
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
              .filter(
                (event) =>
                  event.event_name.match(EventPublicRegex) && isEventInFuture(event.start_at)
              )
              .sort((eventA, eventB) => {
                if (eventA && eventB) {
                  if (Date.parse(eventB.start_at) < Date.parse(eventA.start_at)) {
                    return 1
                  }
                  return -1
                }
              })
          : allPublicEventsData.events
              .filter(
                (event) =>
                  !event.event_name.match(EventPublicRegex) && isEventInFuture(event.start_at)
              )
              .sort((eventA, eventB) => {
                if (eventA && eventB) {
                  if (Date.parse(eventB.start_at) < Date.parse(eventA.start_at)) {
                    return 1
                  }
                  return -1
                }
              })

      if (group.length > 0) {
        return group.map((event) => <EventCard key={event.id} event={event} />)
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
      <div className={classes.pageBanner}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.bannerGradient}
        >
          <Grid item container direction="column" className={classes.pageBannerContentContainer}>
            <Typography variant="h3">All Events</Typography>
          </Grid>
        </Grid>
      </div>

      <Grid container justify="center" alignItems="center">
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

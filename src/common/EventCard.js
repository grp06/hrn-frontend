import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom'
import spustaWeed from '../assets/spustaWeed.jpg'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxWidth: 500,
    fontFamily: 'Muli',
  },
}))

// Right now things are hard coded, but we will query the database and get the
// information for the event
const EventCard = ({ event }) => {
  const { start_at, ended_at, description, event_name, id, host_id } = event
  const classes = useStyles()
  console.log('event =', event)
  return (
    <Card className={classes.cardContainer}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="High Plant"
          height="140"
          image={spustaWeed}
          title="High Plant"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {event_name}
          </Typography>
          <Typography variant="body1">April 20, 4:20 PM</Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Link to={`/events/${id}`}>
          <Button size="small" color="primary" variant="outlined">
            Join Event
          </Button>
        </Link>
        <Button size="small" color="secondary">
          Cancel RSVP
        </Button>
      </CardActions>
    </Card>
  )
}

export default EventCard

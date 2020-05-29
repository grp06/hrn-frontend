import React from 'react'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import formatDate from '../utils/formatDate'
import spustaWeed from '../assets/spustaWeed.jpg'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxWidth: 500,
    marginBottom: 50,
  },
}))

const EventCard = ({ event }) => {
  const { description, event_name, id, host_id, start_at } = event
  const classes = useStyles()
  const history = useHistory()

  const eventTime = formatDate(start_at)
  // const endocdedId = encode(id)
  return (
    <Card className={classes.cardContainer} onClick={() => history.push(`/events/${id}`)}>
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
          <Typography variant="body1">{eventTime}</Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default EventCard

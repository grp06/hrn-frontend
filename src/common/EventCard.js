import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import spustaWeed from '../assets/spustaWeed.jpg'

const useStyles = makeStyles((theme) => ({
  eventsContainer: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  cardContainer: {
    maxWidth: 500,
  },
}))

// Right now things are hard coded, but we will query the database and get the
// information for the event
const EventCard = () => {
  const classes = useStyles()

  return (
    <Container>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">Your Upcoming Events:</Typography>
        </Grid>
        <Grid item className={classes.eventsContainer}>
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
                  Get Smacked Off Your Ass
                </Typography>
                <Typography variant="body1">April 20, 4:20 PM</Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  That plant looks kinda cute, but it would look better in my joint.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" variant="outlined">
                Join Event
              </Button>
              <Button size="small" color="secondary">
                Cancel RSVP
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default EventCard

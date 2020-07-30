import React from 'react'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import FeatherIcon from 'feather-icons-react'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../../assets/logoPurple.svg'
import { FloatCardMediumLarge } from '../../common'

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    width: '75px',
    height: '75px',
  },
  avatar: {
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2, 'auto'),
      marginBottom: 0,
    },
  },
  cardContainer: {
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  city: {
    marginLeft: theme.spacing(1),
  },
  connectionContentContainer: {
    margin: theme.spacing(2, 0),
  },
  tagsContainer: {
    marginTop: theme.spacing(0.5),
    marginLeft: '-5px',
  },
}))

const ConnectionCard = ({ connection }) => {
  const classes = useStyles()
  console.log('connection ->', connection)
  const { name, city, tags_users: connectionsTags } = connection
  console.log(connectionsTags)

  const renderConnectionsTags = () => {
    return connectionsTags
      .sort((tagA, tagB) => {
        return tagA.tag.name.toLowerCase() > tagB.tag.name.toLowerCase()
      })
      .map((tagObject) => {
        const { tag } = tagObject
        return (
          <Chip key={tag.tag_id} label={tag.name} id={tag.tag_id} color="primary" size="small" />
        )
      })
  }

  return (
    <FloatCardMediumLarge>
      <Grid
        container
        alignItems="center"
        justify="space-around"
        wrap="wrap"
        className={classes.cardContainer}
      >
        <Grid container item alignItems="center" justify="center" md={2} xs={12}>
          <Avatar className={classes.avatarContainer}>
            <img alt="company-logo" className={classes.avatar} src={logo} />
          </Avatar>
        </Grid>
        <Grid
          container
          direction="column"
          item
          md={9}
          xs={12}
          className={classes.connectionContentContainer}
        >
          <Typography variant="h4">{name}</Typography>
          <Grid container wrap="wrap" alignItems="center" className={classes.tagsContainer}>
            {renderConnectionsTags()}
          </Grid>
          <Grid container alignItems="center">
            <FeatherIcon icon="map-pin" stroke="#e98dd7" size="20" />
            <Typography variant="subtitle1" className={classes.city}>
              {city}
            </Typography>
          </Grid>
          <Grid
            container
            item
            justify="space-between"
            alignItems="center"
            className={classes.buttonContainer}
            md={3}
            xs={6}
          >
            <Button variant="outlined" color="secondary" size="small">
              Email
            </Button>
            <Button variant="outlined" color="secondary" size="small">
              LinkedIn
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </FloatCardMediumLarge>
  )
}

export default ConnectionCard

import React, { useState } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.grey5,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
  },
  seeAllButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textTransform: 'none',
  },
}))

const EventAttendeesCard = React.memo(({ eventUsers }) => {
  const [seeMore, setSeeMore] = useState(false)
  console.log('eventUsers ->', eventUsers)
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      {eventUsers && eventUsers.length ? (
        <>
          <Typography variant="h2">Attendees {`(${eventUsers.length})`}</Typography>
          <List dense>
            {eventUsers.map(({ user }, idx) => {
              if (idx >= 4 && !seeMore) return null
              console.log(user)
              return (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText disableTypography>
                    <Grid container direction="row" alignItems="center" justify="flex-start">
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="subtitle1">, {user.city}</Typography>
                    </Grid>
                  </ListItemText>
                </ListItem>
              )
            })}
          </List>
          <Button
            variant="text"
            size="small"
            disableRipple
            className={classes.seeAllButton}
            onClick={() => setSeeMore((prevValue) => !prevValue)}
          >
            <Grid container direction="row" alignItems="center" justify="space-around">
              {!seeMore ? (
                <>
                  <Typography variant="body">See All{`  (${eventUsers.length})`}</Typography>
                  <ArrowDropDownIcon fontSize="large" />
                </>
              ) : (
                <>
                  <Typography variant="body">See Less</Typography>
                  <ArrowDropUpIcon fontSize="large" />
                </>
              )}
            </Grid>
          </Button>
        </>
      ) : (
        <Typography variant="body1">No one has signed up yet!</Typography>
      )}
    </Grid>
  )
})

export default EventAttendeesCard

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
import Typography from '@material-ui/core/Typography'

import logo from '../../assets/HRNlogoNoFrame.svg'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
  },
  seeAllButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textTransform: 'none',
  },
}))

const EventRSVPsCard = React.memo(({ eventUsers }) => {
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
          <Typography variant="h3">RSVPs {`(${eventUsers.length})`}</Typography>
          <List dense>
            {eventUsers.map(({ user }, idx) => {
              if (idx >= 4 && !seeMore) return null
              console.log(user)
              return (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <img
                        alt="company-logo"
                        className={classes.avatar}
                        src={user.profile_pic_url || logo}
                      />
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
                  <Typography variant="body1">See All{`  (${eventUsers.length})`}</Typography>
                  <ArrowDropDownIcon fontSize="large" />
                </>
              ) : (
                <>
                  <Typography variant="body1">See Less</Typography>
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

export default EventRSVPsCard

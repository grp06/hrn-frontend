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
    backgroundColor: theme.palette.common.greyCard,
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

const OnlineAttendeesCard = React.memo(({ onlineEventUsers }) => {
  const [seeMore, setSeeMore] = useState(false)
  const classes = useStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      {onlineEventUsers && onlineEventUsers.length ? (
        <>
          <Typography variant="h2">Online Attendees {`(${onlineEventUsers.length})`}</Typography>
          <List dense>
            {onlineEventUsers
              .sort((userA, userB) => {
                return userA.user[0].name
                  .toLowerCase()
                  .localeCompare(userB.user[0].name.toLowerCase())
              })
              .map(({ user }, idx) => {
                if (idx >= 4 && !seeMore) return null
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
                          {user[0].name}
                        </Typography>
                        <Typography variant="subtitle1">, {user[0].city}</Typography>
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
                  <Typography variant="body">See All{`  (${onlineEventUsers.length})`}</Typography>
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
        <Typography variant="body1">No one is online yet</Typography>
      )}
    </Grid>
  )
})

export default OnlineAttendeesCard

import React, { useState } from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { useLobbyStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'

const OnlineAttendeesCard = React.memo(({ onlineEventUsers }) => {
  const [seeMore, setSeeMore] = useState(false)
  const classes = useLobbyStyles()
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.eventAndLobbyContentCard}
    >
      {onlineEventUsers?.length ? (
        <>
          <Typography variant="h3">Online Attendees {`(${onlineEventUsers.length})`}</Typography>
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
                  <ListItem key={user[0].id}>
                    <ListItemAvatar>
                      <Avatar>
                        <img
                          alt="company-logo"
                          className={classes.onlineAttendeeAvatar}
                          src={user[0].profile_pic_url || logo}
                        />
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
          {onlineEventUsers.length > 4 ? (
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
                    <Typography variant="body1">
                      See All{`  (${onlineEventUsers.length})`}
                    </Typography>
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
          ) : null}
        </>
      ) : (
        <Typography variant="body1">No one is online yet</Typography>
      )}
    </Grid>
  )
})

export default OnlineAttendeesCard

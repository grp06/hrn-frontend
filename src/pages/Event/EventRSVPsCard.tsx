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
import { useEventStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { UserObjectInterface } from '../../utils'

interface EventRSVPsCardProps {
  eventUsers: { [user: string]: UserObjectInterface }[]
}

const EventRSVPsCard: React.FC<EventRSVPsCardProps> = React.memo(({ eventUsers }) => {
  const classes = useEventStyles()
  const [seeMore, setSeeMore] = useState<boolean>(false)
  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.eventAndLobbyContentCard}
    >
      {eventUsers?.length ? (
        <>
          <Typography variant="h3">RSVPs {`(${eventUsers.length})`}</Typography>
          <List dense>
            {eventUsers.map(({ user }, idx) => {
              if (idx >= 4 && !seeMore) return null
              return (
                <ListItem key={user.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <img
                        alt="company-logo"
                        className={classes.eventRSVPAvatar}
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
          {eventUsers?.length > 5 ? (
            <Button
              variant="text"
              size="small"
              disableRipple
              className={classes.seeAllRSVPsButton}
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
          ) : null}
        </>
      ) : (
        <Typography variant="body1">No one has signed up yet!</Typography>
      )}
    </Grid>
  )
})

export default EventRSVPsCard

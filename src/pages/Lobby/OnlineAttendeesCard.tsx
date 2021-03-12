import React, { useState } from 'react'
import partition from 'lodash/partition'
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
import { OnlineEventUsersInterface } from '../../utils'

interface OnlineAttendeesCardProps {
  eventStatus: string
  matching_type: string
  onlineEventUsers: OnlineEventUsersInterface[]
  side_aLabel: string
  side_bLabel: string
}

const OnlineAttendeesCard: React.FC<OnlineAttendeesCardProps> = React.memo(
  ({ eventStatus, matching_type, onlineEventUsers, side_aLabel, side_bLabel }) => {
    const classes = useLobbyStyles()
    const [seeMore, setSeeMore] = useState<boolean>(false)
    const maxIndexToShowTo = matching_type === 'two-sided' ? 2 : 4

    // returns an array with two arrays. First array is onlineEventUsers with side a
    // second array is onlineEventUsers with side b
    const twoSidedOnlineEventUsers = partition(onlineEventUsers, { side: 'a' })

    const populateList = (
      eventUsersArray: OnlineEventUsersInterface[]
    ): JSX.Element | (JSX.Element | null)[] => {
      return eventUsersArray?.length ? (
        eventUsersArray
          .sort((userA, userB) => {
            return userA.user[0].name
              .toString()
              .toLowerCase()
              .localeCompare(userB.user[0].name.toString().toLowerCase())
          })
          .map(({ user }, idx) => {
            if (idx >= maxIndexToShowTo && !seeMore) return null
            return (
              <ListItem key={user[0].id.toString()}>
                <ListItemAvatar>
                  <Avatar>
                    <img
                      alt="company-logo"
                      className={classes.onlineAttendeeAvatar}
                      src={user[0].profile_pic_url?.toString() || logo}
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
          })
      ) : (
        <Typography variant="body1">
          Waiting for people to get online{' '}
          <span role="img" aria-label="man bowing">
            🙇‍♂️
          </span>
        </Typography>
      )
    }

    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.eventAndLobbyContentCard}
      >
        <>
          <Typography variant="h3">
            {eventStatus === 'not-started'
              ? `Online Attendees (${onlineEventUsers.length})`
              : `Attendees in the Lobby (${onlineEventUsers.length})`}
          </Typography>
          <List dense>
            {matching_type === 'two-sided' ? (
              <>
                <Typography variant="body1" className={classes.side_aLabel}>
                  • {side_aLabel}:
                </Typography>
                {populateList(twoSidedOnlineEventUsers[0])}
                <Typography variant="body1" className={classes.side_bLabel}>
                  • {side_bLabel}:
                </Typography>
                {populateList(twoSidedOnlineEventUsers[1])}
              </>
            ) : (
              <>{populateList(onlineEventUsers)}</>
            )}
          </List>
          {onlineEventUsers?.length > maxIndexToShowTo ? (
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
      </Grid>
    )
  }
)

export default OnlineAttendeesCard

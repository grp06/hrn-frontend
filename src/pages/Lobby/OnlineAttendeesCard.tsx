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
import { RequestToChatButton, useLobbyStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import {
  EventObjectInterface,
  OnlineEventUsersInterface,
  PartnersObjectInterface,
} from '../../utils'

interface OnlineAttendeesCardProps {
  chatRequests: PartnersObjectInterface[] | undefined
  event: EventObjectInterface
  onlineEventUsers: OnlineEventUsersInterface[]
  userId: number
}

const OnlineAttendeesCard: React.FC<OnlineAttendeesCardProps> = React.memo(
  ({ chatRequests, event, onlineEventUsers, userId }) => {
    const classes = useLobbyStyles()
    const {
      current_round,
      id: event_id,
      matching_type,
      side_a: side_aLabel,
      side_b: side_bLabel,
      status: eventStatus,
    } = event
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
                  <Grid container direction="row" alignItems="center" justify="space-between">
                    <Grid container direction="row" alignItems="center" style={{ width: 'auto' }}>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        {user[0].name}
                      </Typography>
                      <Typography variant="subtitle1">, {user[0].city}</Typography>
                    </Grid>
                    {((user[0].id as unknown) as number) !== userId ? (
                      <RequestToChatButton
                        myPartnerRow={chatRequests?.find(
                          (chatRequest) =>
                            chatRequest.partner_id === ((user[0].id as unknown) as number)
                        )}
                        event={event}
                        partnerId={(user[0].id as unknown) as number}
                        userId={userId}
                      />
                    ) : null}
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
          <List style={{ width: '100%' }} dense>
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

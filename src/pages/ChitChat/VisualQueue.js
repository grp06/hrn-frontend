import React, { useState } from 'react'
import { Button, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from '@material-ui/icons'
import { VisualQueueInstructionModal } from '.'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(1.5),
    margin: theme.spacing(2, 0, 4, 0),
  },
  highlightMyRow: {
    backgroundColor: theme.palette.common.greyHover,
    borderRadius: '4px',
    border: '1px solid #FF99AD',
  },
  queueNumber: {
    color: theme.palette.common.basePink,
    fontWeight: 500,
    fontSize: '1.125rem',
    marginRight: theme.spacing(1),
  },
  seeAllButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textTransform: 'none',
  },
}))

const VisualQueue = React.memo(({ chitChatRSVPs, hostName, onlineChitChatUsers, userId }) => {
  const classes = useStyles()
  const [seeMore, setSeeMore] = useState(false)
  const hostFirstName = hostName && hostName.split(' ')[0]

  const sanitizedOnlineChitChatUsers = onlineChitChatUsers
    .map((onlineUser) => {
      const usersRSVPObject = chitChatRSVPs.reduce((acc, RSVPedUser, idx) => {
        if (RSVPedUser.user_id === onlineUser.user_id) {
          return (acc = { name: RSVPedUser.user.name, RSVPNumber: idx + 1 })
        }
        return acc
      }, {})

      if (usersRSVPObject) {
        return { ...onlineUser, ...usersRSVPObject }
      }
      return onlineUser
    })
    .filter((user) => user.status === 'in-queue')

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.cardContainer}
    >
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Typography variant="h4">Queue to meet {hostFirstName}</Typography>
        <VisualQueueInstructionModal hostFirstName={hostFirstName} />
      </Grid>
      {sanitizedOnlineChitChatUsers && sanitizedOnlineChitChatUsers.length ? (
        <>
          <List dense style={{ width: '100%' }}>
            {sanitizedOnlineChitChatUsers
              .sort((userA, userB) => {
                return userA.RSVPNumber < userB.RSVPNumber
              })
              .map((user, idx) => {
                if (idx >= 4 && !seeMore) return null
                return (
                  <ListItem
                    key={user.id}
                    className={user.user_id === userId ? classes.highlightMyRow : null}
                  >
                    <ListItemText disableTypography>
                      <Grid container direction="row" alignItems="center" justify="space-between">
                        <Typography variant="body1" style={{ fontWeight: 500 }}>
                          <span className={classes.queueNumber}>{idx + 1}. </span>
                          {user.name}
                        </Typography>
                        <Typography variant="subtitle1">RSVP # {user.RSVPNumber}</Typography>
                      </Grid>
                    </ListItemText>
                  </ListItem>
                )
              })}
          </List>
          {onlineChitChatUsers.length > 4 ? (
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
                      See All{`  (${onlineChitChatUsers.length})`}
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
      <Typography variant="subtitle1">
        You can leave this page, but if you’re not here when it’s your turn, you will be skipped.
        Don&apos;t worry, we&apos;ll send you a SMS text when your turn is coming up!{' '}
        <span role="img" aria-label="thumbs up">
          👍
        </span>
      </Typography>
    </Grid>
  )
})

export default VisualQueue

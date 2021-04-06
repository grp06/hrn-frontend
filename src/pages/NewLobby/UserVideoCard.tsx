import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { useNewLobbyStyles } from '.'

export interface UserVideoCardProps {
  height: number
  name: string
  userId: string
  width: number
}

const UserVideoCard: React.FC<UserVideoCardProps> = ({ height, name, userId, width }) => {
  const classes = useNewLobbyStyles()
  return (
    <div id={userId} className={classes.userVideoCard} style={{ height, width }}>
      <Grid container direction="row" className={classes.userNameAndMicDiv}>
        <Typography variant="body1">{name}</Typography>
        <div id={`${userId}-mic-off-icon-div`} className={classes.micOffIconDiv} />
      </Grid>
    </div>
  )
}

export default UserVideoCard

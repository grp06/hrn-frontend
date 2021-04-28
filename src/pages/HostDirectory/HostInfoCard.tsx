import React from 'react'
import moment from 'moment-timezone'
import { Avatar, Grid, Typography } from '@material-ui/core'
import { useHostDirectoryStyles } from '.'
import logo from '../../assets/HRNlogoNoFrame.svg'
import { UserObjectInterface } from '../../utils'

interface HostInfoCardProps {
  hostInfo: UserObjectInterface
}

const HostInfoCard: React.FC<HostInfoCardProps> = ({ hostInfo }) => {
  const classes = useHostDirectoryStyles()
  const {
    became_host_at,
    city,
    email,
    linkedIn_url,
    first_name,
    last_name,
    profile_pic_url,
    role,
    sub_period_end,
  } = hostInfo

  const renderLinkedInLink = () => {
    return linkedIn_url ? (
      <a
        className={classes.aTag}
        href={linkedIn_url.includes('http') ? linkedIn_url : `https://${linkedIn_url}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn Profile
      </a>
    ) : (
      <Typography variant="body1">
        No LinkedIn Profile{' '}
        <span role="img" aria-label="sad cry">
          😥
        </span>{' '}
      </Typography>
    )
  }

  return (
    <Grid container direction="row" className={classes.hostInfoCardContainer}>
      <Avatar className={classes.hostDirectoryAvatarContainer}>
        <img
          alt="company-logo"
          className={classes.hostDirectoryAvatar}
          src={profile_pic_url || logo}
        />
      </Avatar>
      <Grid
        container
        direction="column"
        justify="center"
        className={classes.hostInfoContentContainer}
      >
        <Typography variant="h2">{`${first_name} ${last_name || ''}`}</Typography>
        <Typography variant="body1">{city}</Typography>
        <Typography variant="body1">{email}</Typography>
        {renderLinkedInLink()}
      </Grid>
      <Grid
        container
        direction="column"
        justify="flex-end"
        className={classes.hostInfoContentContainer}
      >
        <Typography variant="body1">{role}</Typography>
        <Typography variant="body1">
          became host: {moment(became_host_at).format('MMM Do YY')}
        </Typography>
        <Typography variant="body1">
          sub ends: {moment(sub_period_end).format('MMM Do YY')}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default HostInfoCard

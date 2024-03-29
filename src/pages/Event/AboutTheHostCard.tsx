import React from 'react'
// @ts-ignore
import FeatherIcon from 'feather-icons-react'
import { useHistory } from 'react-router-dom'
import { Button, Grid, Typography } from '@material-ui/core'
import { useEventStyles } from '.'
import { UserObjectInterface } from '../../utils'

interface AboutTheHostCardProps {
  host: UserObjectInterface
  userIsHost: boolean
}

const AboutTheHostCard: React.FC<AboutTheHostCardProps> = React.memo(({ host, userIsHost }) => {
  const classes = useEventStyles()
  const history = useHistory()
  const { short_bio: hostBio } = host

  const handleEditBioClick = () => history.push('/my-profile')

  return (
    <Grid
      container
      direction="column"
      className={classes.eventAndLobbyContentCard}
      style={{ position: 'relative' }}
    >
      {userIsHost ? (
        <Button
          variant="text"
          disableRipple
          className={classes.editBioButton}
          onClick={handleEditBioClick}
        >
          <FeatherIcon icon="edit-2" size="20" />
        </Button>
      ) : null}
      <Typography variant="h3" className={classes.eventAndLobbyContentCardTitle}>
        About The Host
      </Typography>
      <Typography variant="body1" style={{ width: '90%' }}>
        {hostBio ||
          "Your host has forgotten to write about themselves, but trust us, they're pretty awesome ✨"}
      </Typography>
    </Grid>
  )
})

export default AboutTheHostCard

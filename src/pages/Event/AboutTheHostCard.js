import React from 'react'
import { useHistory } from 'react-router-dom'
import FeatherIcon from 'feather-icons-react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    position: 'relative',
    backgroundColor: theme.palette.common.greyCard,
    borderRadius: '4px',
    height: 'auto',
    padding: theme.spacing(3, 5),
    marginBottom: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3, 3),
    },
  },
  editBioButton: {
    position: 'absolute',
    top: '5%',
    left: 'auto',
    right: 0,
    bottom: 'auto',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.common.basePink,
    },
  },
}))

const AboutTheHostCard = React.memo(({ host, userIsHost }) => {
  const classes = useStyles()
  const history = useHistory()
  const { short_bio: hostBio } = host
  console.log('host ->', host)
  console.log('hostBio ->', hostBio)

  const handleEditBioClick = () => history.push('/my-profile')

  return (
    <Grid container direction="column" className={classes.cardContainer}>
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
      <Typography variant="h3">About The Host</Typography>
      <Typography variant="body1" style={{ width: '90%' }}>
        {hostBio ||
          "Your host has forgotten to write about themselves, but trust us, they're pretty awesome ✨"}
      </Typography>
    </Grid>
  )
})

export default AboutTheHostCard

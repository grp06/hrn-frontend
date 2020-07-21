import React from 'react'
import { FloatCardNarrow } from '../../common'
import { makeStyles } from '@material-ui/styles'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import { SidebarAchievements, SidebarTags } from '.'

const createStyles = makeStyles((theme) => ({
  avatar: {
    width: '125px',
    height: '125px',
  },
  avatarContainer: {
    width: '125px',
    height: '125px',
    marginBottom: theme.spacing(2),
  },
  editProfileButton: {
    margin: theme.spacing(2, 0),
  },
}))

const MyProfileSidebar = ({ user }) => {
  const classes = createStyles()
  const { name, city, tags_users: usersTags } = user
  return (
    <FloatCardNarrow>
      <Grid container direction="column" alignItems="center" justify="center">
        <Avatar className={classes.avatarContainer}>
          <PersonIcon className={classes.avatar} />
        </Avatar>
        <Typography variant="h5">{name}</Typography>
        <Typography variant="subtitle1">{city}</Typography>
        <Button variant="contained" color="primary" className={classes.editProfileButton}>
          Edit Profile
        </Button>
        <SidebarAchievements />
        <SidebarTags usersTags={usersTags} />
      </Grid>
    </FloatCardNarrow>
  )
}

export default MyProfileSidebar

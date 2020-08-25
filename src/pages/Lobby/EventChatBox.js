import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '70%',
    backgroundColor: 'pink',
    margin: theme.spacing(4),
  },
}))

const EventChatBox = () => {
  const classes = useStyles()
  return <div className={classes.container}>Event Chat Box</div>
}

export default EventChatBox

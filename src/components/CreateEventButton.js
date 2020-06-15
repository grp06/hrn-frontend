import React from 'react'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '2em',
    marginBottom: '2em',
    '& a': {
      textDecoration: 'none',
    },
    position: 'fixed',
    left: 'auto',
    top: 'auto',
    right: '3%',
    bottom: '3%',
    zIndex: '999',
  },
  button: {
    backgroundImage: 'linear-gradient(to bottom, #6638aa, #8b4cb2, #aa63bb, #c67cc5, #df97d1)',
    // background: 'rgb(102,56,170)',
    // background: 'linear-gradient(137deg, rgba(102,56,170,1) 40%, rgba(223,151,209,1) 100%)',
    // background: 'rgb(102,56,170)',
    // background: 'radial-gradient(circle, rgba(102,56,170,1) 60%, rgba(223,151,209,1) 100%)',
    // background: 'rgb(102,56,170)',
    // background:
    //   'linear-gradient(90deg, rgba(102,56,170,1) 25%, rgba(223,151,209,1) 75%, rgba(237,184,104,1) 100%)',
  },
}))
const CreateEventButton = () => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Link to="/create-event">
        <Fab variant="extended" className={classes.button} size="large">
          Host An Event 🚀
        </Fab>
      </Link>
    </div>
  )
}
export default CreateEventButton

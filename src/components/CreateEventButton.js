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
}))
const CreateEventButton = () => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Link to="/create-event">
        <Fab variant="extended" color="primary" size="large">
          Host An Event 🚀
        </Fab>
      </Link>
    </div>
  )
}
export default CreateEventButton

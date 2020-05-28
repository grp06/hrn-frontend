import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: '2em',
    marginBottom: '2em',
    '& a': {
      textDecoration: 'none',
    },
  },
}))
const CreateEventButton = () => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <Link to="/create-event">
        <Button size="small" color="primary" variant="outlined">
          Create Event
        </Button>
      </Link>
    </div>
  )
}
export default CreateEventButton

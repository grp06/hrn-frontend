import React from 'react'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '15%',
    backgroundColor: 'green',
  },
}))

const UserStatusBox = () => {
  const classes = useStyles()
  return <div className={classes.container}>User Status Box</div>
}

export default UserStatusBox

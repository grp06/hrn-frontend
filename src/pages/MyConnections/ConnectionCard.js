import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { FloatCardMediumLarge } from '../../common'

const useStyles = makeStyles((theme) => ({
  connectionContainer: {
    width: '100%',
    position: 'relative',
    height: '200px',
  },
  icon: {
    color: theme.palette.common.ghostWhiteBody,
    margin: theme.spacing(0.5, 0),
  },
  subtitle: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.common.orchid,
    fontWeight: '500',
  },
}))
const ConnectionCard = ({ connection }) => {
  console.log('connection ->', connection)
  const classes = useStyles()
  return (
    <FloatCardMediumLarge>
      <Grid className={classes.connectionContainer}>{connection.name}</Grid>
    </FloatCardMediumLarge>
  )
}

export default ConnectionCard

import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  aTag: {
    textDecoration: 'none',
    color: theme.palette.common.sunray,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.common.ghostWhite,
    },
  },
  container: {
    margin: theme.spacing(4, 'auto'),
    width: '75vw',
    [theme.breakpoints.down('sm')]: {
      width: '90vw',
    },
  },
  table: {
    minWidth: 650,
  },
}))

const HostInfoTable = ({ arrayOfHosts }) => {
  const classes = useStyles()

  const renderLinkedInLink = (linkedInURL) => {
    if (linkedInURL) {
      return (
        <a
          className={classes.aTag}
          href={linkedInURL.includes('http') ? linkedInURL : `https://${linkedInURL}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          profile
        </a>
      )
    }
    return 'N/A'
  }
  return (
    <div className={classes.container}>
      <Typography variant="h3" style={{ marginBottom: '16px' }}>
        {arrayOfHosts[0].role}:
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">email</TableCell>
              <TableCell align="right">city</TableCell>
              <TableCell align="right">role</TableCell>
              <TableCell align="right">linkedIn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayOfHosts.map((host) => (
              <TableRow key={host.name}>
                <TableCell component="th" scope="row">
                  {host.name}
                </TableCell>
                <TableCell align="right">{host.email}</TableCell>
                <TableCell align="right">{host.city}</TableCell>
                <TableCell align="right">{host.role}</TableCell>
                <TableCell align="right">{renderLinkedInLink(host.linkedIn_url)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default HostInfoTable

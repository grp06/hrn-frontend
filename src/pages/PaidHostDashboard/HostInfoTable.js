import React from 'react'
import moment from 'moment-timezone'
import { useHistory } from 'react-router-dom'
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import PersonPinIcon from '@material-ui/icons/PersonPin'

import { usePaidHostDashboardStyles } from '.'

const HostInfoTable = ({ arrayOfHosts, hideSubPeriodEnd }) => {
  const classes = usePaidHostDashboardStyles()
  const history = useHistory()

  const handleMoreHostInfoClick = (host) => {
    history.push(`/paid-host-dashboard/${host.id}`, { host })
  }

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
    <div className={classes.hostInfoContainer}>
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
              <TableCell align="right">linkedIn</TableCell>
              <TableCell align="right">became host</TableCell>
              {!hideSubPeriodEnd ? <TableCell align="right">sub ends</TableCell> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {arrayOfHosts.map((host, idx) => (
              <TableRow key={host.name}>
                <TableCell component="th" scope="row">
                  <IconButton
                    color={(idx + 1) % 2 === 0 ? 'secondary' : 'default'}
                    onClick={() => handleMoreHostInfoClick(host)}
                  >
                    <PersonPinIcon />
                  </IconButton>
                  {host.name}
                </TableCell>
                <TableCell align="right">{host.email}</TableCell>
                <TableCell align="right">{host.city}</TableCell>
                <TableCell align="right">{renderLinkedInLink(host.linkedIn_url)}</TableCell>
                <TableCell align="right">
                  {moment(host.became_host_at).format('MMM Do YY')}
                </TableCell>
                {!hideSubPeriodEnd ? (
                  <TableCell align="right">
                    {moment(host.sub_period_end).format('MMM Do YY')}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default HostInfoTable

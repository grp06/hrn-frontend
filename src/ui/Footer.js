import React from 'react'

import { Grid, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  footer: {
    width: '100%',
    position: 'relative',
  },
  mainContainer: {
    backgroundColor: theme.palette.common.dankPurp,
    position: 'absolute',
  },
  link: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  gridItem: {
    margin: '1em',
  },
}))

const Footer = (props) => {
  const classes = useStyles()

  const routes = [
    { name: 'Home', link: '/', activeIndex: 0 },
    { name: 'My Events', link: '/myevents', activeIndex: 1 },
    { name: 'About Us', link: '/about', activeIndex: 2 },
    { name: 'Contact Us', link: '/contact', activeIndex: 3 },
    { name: 'Test', link: '/test', activeIndex: 4 },
  ]

  return (
    <footer className={classes.footer}>
      <Hidden mdDown>
        <Grid container justify="center" className={classes.mainContainer}>
          {routes.map((route, idx) => (
            <Grid item className={classes.gridItem} key={idx}>
              <Grid container direction="column">
                <Grid
                  item
                  className={classes.link}
                  component={Link}
                  to={route.link}
                  onClick={() => props.setActiveTab(route.activeIndex)}
                >
                  {route.name}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Hidden>
    </footer>
  )
}

export default Footer

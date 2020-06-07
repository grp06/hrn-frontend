import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect, withRouter } from 'react-router-dom'

import makeApolloClient from './apollo'
import { LoginForm, EventForm, ErrorBoundary } from './common'
import { Event, Events, VideoRoom, GameOver, SignUp } from './components'
import { GameProvider } from './context/provider'
import Footer from './ui/Footer'
import Header from './ui/Header'
import theme from './ui/theme'

const App = () => {
  const [client, setClient] = useState(null)
  const [activeTab, setActiveTab] = useState(0)

  async function createClient() {
    try {
      const apolloClient = await makeApolloClient()
      setClient(apolloClient)
    } catch {
      setClient(null)
    }
  }

  useEffect(() => {
    createClient()
  }, [])

  if (!client) {
    return null
  }

  // the last route is for naughty urls
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <ApolloProvider client={client}>
          <Router>
            <ErrorBoundary>
              <GameProvider>
                <Switch>
                  <Route exact path="/" component={LoginForm} />
                  <Route exact path="/events" component={Events} />
                  <Route exact path="/video-room" component={VideoRoom} />
                  <Route exact path="/create-event" component={EventForm} />
                  <Route exact path="/events/:id" component={Event} />
                  <Route exact path="/event-complete" component={GameOver} />
                  <Route exact path="/sign-up" component={SignUp} />
                  <Route component={() => <Redirect to={{ pathname: '/events' }} />} />
                </Switch>
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
              </GameProvider>
            </ErrorBoundary>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App
//            <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
// route to root when the go to a bad route

import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect, withRouter } from 'react-router-dom'

import makeApolloClient from './apollo'
import { LoginForm, EventForm, ErrorBoundary } from './common'
import {
  Event,
  Events,
  VideoRoom,
  GameOver,
  SignUp,
  PreEvent,
  ForgotPassword,
  SetNewPassword,
  HostDashboard,
} from './components'
import { AppProvider } from './context/AppProvider'
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
              <AppProvider>
                <Switch>
                  <Route exact path="/" component={LoginForm} />
                  <Route exact path="/sign-up" component={SignUp} />
                  <Route exact path="/forgot-password" component={ForgotPassword} />
                  <Route
                    exact
                    path="/set-new-password/:userId/:token/"
                    component={SetNewPassword}
                  />
                  <Route exact path="/create-event" component={EventForm} />
                  <Route exact path="/host-dashboard" component={HostDashboard} />
                  <Route exact path="/events" component={Events} />
                  <Route exact path="/events/:id" component={Event} />
                  <Route exact path="/events/:id/video-room" component={VideoRoom} />
                  <Route exact path="/events/:id/pre-event" component={PreEvent} />
                  <Route exact path="/events/:id/event-complete" component={GameOver} />
                  <Route component={() => <Redirect to={{ pathname: '/events' }} />} />
                </Switch>
                <Header activeTab={activeTab} setActiveTab={setActiveTab} />
              </AppProvider>
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

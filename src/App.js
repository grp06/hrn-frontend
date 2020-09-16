import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import makeApolloClient from './apollo'
import { useIntercom } from 'react-use-intercom'

import { EventForm, ErrorBoundary } from './common'
import {
  Event,
  MyEvents,
  EventComplete,
  EventsPublic,
  ForgotPassword,
  HostDashboard,
  HRNAnalytics,
  LoginForm,
  MyProfile,
  MyConnections,
  Onboarding,
  PreEvent,
  PrivacyPolicy,
  SetNewPassword,
  SignUp,
  VideoRoom,
} from './pages'
import { AppProvider } from './context/AppProvider'
import HeaderDrawer from './ui/Header/HeaderDrawer'
import MarginLeftAppWrapper from './ui/MarginLeftAppWrapper'
import GetTagsModal from './ui/Subheader/GetTagsModal'
import theme from './ui/theme'

const App = () => {
  const { boot } = useIntercom()
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

  useEffect(() => {
    boot()
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
                  <MarginLeftAppWrapper>
                    <Route exact path="/" component={LoginForm} />
                    <Route exact path="/sign-up" component={SignUp} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route
                      exact
                      path="/set-new-password/:userId/:token"
                      component={SetNewPassword}
                    />
                    <Route exact path="/onboarding" component={Onboarding} />
                    <Route exact path="/my-profile" component={MyProfile} />
                    <Route exact path="/my-connections" component={MyConnections} />
                    <Route exact path="/create-event" component={EventForm} />
                    <Route exact path="/host-dashboard" component={HostDashboard} />
                    <Route exact path="/hrn-analytics" component={HRNAnalytics} />
                    <Route
                      exact
                      path="/events/public"
                      component={() => <Redirect to={{ pathname: '/events' }} />}
                    />
                    <Route exact path="/events" component={EventsPublic} />
                    <Route exact path="/my-events" component={MyEvents} />
                    <Route exact path="/events/:id" component={Event} />
                    <Route exact path="/events/:id/video-room" component={VideoRoom} />
                    <Route exact path="/events/:id/pre-event" component={PreEvent} />
                    <Route exact path="/events/:id/event-complete" component={EventComplete} />
                    <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                  </MarginLeftAppWrapper>
                  <Route component={() => <Redirect to={{ pathname: '/events' }} />} />
                </Switch>
                <HeaderDrawer activeTab={activeTab} setActiveTab={setActiveTab} />
                <GetTagsModal />
              </AppProvider>
            </ErrorBoundary>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App

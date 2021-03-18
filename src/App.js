import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import makeApolloClient from './apollo'
import IntercomMessenger from './IntercomMessenger'

import { ErrorBoundary } from './common'
import {
  Checkout,
  CheckoutSuccess,
  CreateEvent,
  Event,
  MyEvents,
  EventComplete,
  EventGroupVideoChat,
  EventsPublic,
  ForgotPassword,
  HostDashboard,
  HostDirectory,
  HostEventProfile,
  HostOnboarding,
  HRNAnalytics,
  Lobby,
  LoginForm,
  MyProfile,
  MyConnections,
  VideoRoom,
  Onboarding,
  PaidHostDashboard,
  PrivacyPolicy,
  Subscription,
  SetNewPassword,
  SignUp,
} from './pages'
import { EventProvider, TwilioProvider, UserProvider, UserEventStatusProvider } from './context'
import HeaderDrawer from './ui/Header/HeaderDrawer'
import MarginLeftAppWrapper from './ui/MarginLeftAppWrapper'
import GetTagsModal from './ui/Subheader/GetTagsModal'
import ProfilePictureModal from './ui/Subheader/ProfilePictureModal'
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
              <UserProvider>
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
                    <Route exact path="/checkout" component={Checkout} />
                    <Route exact path="/checkout-success" component={CheckoutSuccess} />
                    <Route exact path="/create-event" component={CreateEvent} />
                    <Route exact path="/host-dashboard" component={HostDashboard} />
                    <Route exact path="/host-onboarding" component={HostOnboarding} />
                    <Route exact path="/hrn-analytics" component={HRNAnalytics} />
                    <Route exact path="/my-connections" component={MyConnections} />
                    <Route exact path="/my-profile" component={MyProfile} />
                    <Route exact path="/onboarding" component={Onboarding} />
                    <Route exact path="/paid-host-dashboard" component={PaidHostDashboard} />
                    <Route exact path="/paid-host-dashboard/:id" component={HostEventProfile} />
                    <Route exact path="/subscription" component={Subscription} />
                    <Route exact path="/my-events" component={MyEvents} />
                    <Route exact path="/events" component={EventsPublic} />
                    <EventProvider>
                      <Route
                        exact
                        path="/events/public"
                        component={() => <Redirect to={{ pathname: '/events' }} />}
                      />
                      <Route exact path="/events/:id" component={Event} />
                      <TwilioProvider>
                        <UserEventStatusProvider>
                          <Route exact path="/events/:id/lobby" component={Lobby} />
                          <Route exact path="/events/:id/video-room" component={VideoRoom} />
                          <Route
                            exact
                            path="/events/:id/group-video-chat"
                            component={EventGroupVideoChat}
                          />
                          <Route
                            exact
                            path="/events/:id/event-complete"
                            component={EventComplete}
                          />
                        </UserEventStatusProvider>
                      </TwilioProvider>
                    </EventProvider>
                    <Route exact path="/privacy-policy" component={PrivacyPolicy} />
                  </MarginLeftAppWrapper>
                  <Route component={() => <Redirect to={{ pathname: '/events' }} />} />
                </Switch>
                <HeaderDrawer activeTab={activeTab} setActiveTab={setActiveTab} />
                <GetTagsModal />
                <ProfilePictureModal />
                <IntercomMessenger />
              </UserProvider>
            </ErrorBoundary>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App

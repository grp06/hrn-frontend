import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import makeApolloClient from './apollo'
import { useIntercom } from 'react-use-intercom'
import { constants } from './utils'
import './intercom.css'

import { ErrorBoundary } from './common'
import {
  CelebProfile,
  Checkout,
  CheckoutSuccess,
  CreateEvent,
  Event,
  ChitChat,
  MyEvents,
  EventComplete,
  EventGroupVideoChat,
  EventsPublic,
  ForgotPassword,
  HostDashboard,
  HostOnboarding,
  HRNAnalytics,
  Lobby,
  LoginForm,
  CreatorLogin,
  MyProfile,
  MyConnections,
  VideoRoom,
  Onboarding,
  PaidHostDashboard,
  PrivacyPolicy,
  Subscription,
  SetNewPassword,
  SignUp,
  CelebSignUp,
  CreateChitChat,
  CreatorHome,
  ChitChatVideoRoom,
  CallCompleted,
} from './pages'
import {
  AppProvider,
  ChitChatProvider,
  EventProvider,
  TwilioProvider,
  UserProvider,
  UserEventStatusProvider,
} from './context'
import HeaderDrawer from './ui/Header/HeaderDrawer'
import MarginLeftAppWrapper from './ui/MarginLeftAppWrapper'
import GetTagsModal from './ui/Subheader/GetTagsModal'
import ProfilePictureModal from './ui/Subheader/ProfilePictureModal'
import theme from './ui/theme'

const App = () => {
  const { boot } = useIntercom()
  const [client, setClient] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const { intercomAppId } = constants

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
    boot({ customAttributes: { custom_launcher_selector: '.intercom-launcher' } })
  }, [])

  if (!client) {
    return null
  }

  const timeout = setTimeout(() => clearInterval(interval), 30000)
  const interval = setInterval(() => {
    if (window.Intercom.booted) {
      const launcher = document.querySelector('.intercom-launcher')
      const unreadCount = launcher.querySelector('.intercom-unread-count')

      window.Intercom('onShow', () => {
        launcher.classList.add('intercom-open')
      })

      window.Intercom('onHide', () => {
        launcher.classList.remove('intercom-open')
      })

      window.Intercom('onUnreadCountChange', (count) => {
        unreadCount.textContent = count

        if (count) {
          unreadCount.classList.add('active')
        } else {
          unreadCount.classList.remove('active')
        }
      })

      launcher.classList.add('intercom-booted')
      clearInterval(interval)
      clearTimeout(timeout)
    }
  })

  // the last route is for naughty urls
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <ApolloProvider client={client}>
          <Router>
            <ErrorBoundary>
              <AppProvider>
                <UserProvider>
                  <Switch>
                    <MarginLeftAppWrapper>
                      <Route exact path="/" component={LoginForm} />
                      <Route exact path="/creator-login" component={CreatorLogin} />
                      <Route exact path="/sign-up" component={SignUp} />
                      <Route exact path="/creator-sign-up" component={CelebSignUp} />
                      <Route exact path="/forgot-password" component={ForgotPassword} />
                      <Route
                        exact
                        path="/set-new-password/:userId/:token"
                        component={SetNewPassword}
                      />
                      <Route exact path="/onboarding" component={Onboarding} />
                      <Route exact path="/celeb-profile" component={CelebProfile} />
                      <Route exact path="/host-onboarding" component={HostOnboarding} />
                      <Route exact path="/my-profile" component={MyProfile} />
                      <Route exact path="/my-connections" component={MyConnections} />
                      <Route exact path="/create-event" component={CreateEvent} />
                      <Route exact path="/create-chit-chat" component={CreateChitChat} />
                      <Route exact path="/creator-home" component={CreatorHome} />
                      <Route exact path="/subscription" component={Subscription} />
                      <Route exact path="/checkout" component={Checkout} />
                      <Route exact path="/checkout-success" component={CheckoutSuccess} />
                      <Route exact path="/host-dashboard" component={HostDashboard} />
                      <Route exact path="/hrn-analytics" component={HRNAnalytics} />
                      <Route exact path="/paid-host-dashboard" component={PaidHostDashboard} />
                      <ChitChatProvider>
                        <Route exact path="/chit-chat/:id" component={ChitChat} />
                        <Route
                          exact
                          path="/chit-chat/:id/video-room"
                          component={ChitChatVideoRoom}
                        />
                        <Route
                          exact
                          path="/chit-chat/:id/call-completed"
                          component={CallCompleted}
                        />
                      </ChitChatProvider>
                      <EventProvider>
                        <Route
                          exact
                          path="/events/public"
                          component={() => <Redirect to={{ pathname: '/events' }} />}
                        />
                        <Route exact path="/my-events" component={MyEvents} />
                        <Route exact path="/events" component={EventsPublic} />
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
                  <a
                    className="intercom-launcher"
                    href={`mailto:${intercomAppId}@incoming.intercom.io`}
                  >
                    <div className="intercom-icon-close" />
                    <div className="intercom-icon-open" />
                    <div className="intercom-unread-count" />
                  </a>
                </UserProvider>
              </AppProvider>
            </ErrorBoundary>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App

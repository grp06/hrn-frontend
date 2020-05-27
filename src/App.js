import React, { useState, useEffect } from 'react'

import { StylesProvider, ThemeProvider } from '@material-ui/core/styles'
import { ApolloProvider } from 'react-apollo'
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'

import makeApolloClient from './apollo'
import { LoginForm, EventForm } from './common'
import { Test, Event, Events } from './components'

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

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <ApolloProvider client={client}>
          <Router>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <Switch>
              <GameProvider>
                <Route exact path="/" component={LoginForm} />
                <Route exact path="/events" component={Events} />
                <Route exact path="/events/:id" component={Event} />
                <Route exact path="/events/new" component={EventForm} />
                <Route exact path="/about" component={() => <div>About Us</div>} />
                <Route exact path="/contact" component={() => <div>Contact Us</div>} />
                <Route exact path="/test" component={Test} />
                <Route component={() => <Redirect to={{ pathname: '/events' }} />} />
              </GameProvider>
            </Switch>
          </Router>
        </ApolloProvider>
      </StylesProvider>
    </ThemeProvider>
  )
}

export default App
//            <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
// route to root when the go to a bad route
